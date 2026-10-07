(function () {
  "use strict";
  const D = window.LS_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- helpers ---------- */
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmtTime = (m) => {
    m = Math.round(m);
    const h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, "0");
    return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? "AM" : "PM"}`;
  };
  const fmtDur = (m) => {
    m = Math.round(m);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? (m % 60) + "m" : ""}`.trim() : `${m} min`;
  };
  const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function km(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  // Estimated door-to-door minutes between two neighborhoods
  function travel(areaA, areaB) {
    if (areaA === areaB) return { min: 5, mode: "walk" };
    const d = km(D.places[areaA], D.places[areaB]) * 1.3; // street-grid factor
    if (d < 1.0) return { min: Math.max(5, Math.round(d * 13)), mode: "walk" };
    return { min: Math.round(8 + d * 4.5), mode: "transit/rideshare" };
  }

  /* ---------- screens ---------- */
  function show(id) {
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
    const h = $(`#${id} h1, #${id} h2`);
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-go]");
    if (t) { e.preventDefault(); show(t.dataset.go); }
  });

  /* ---------- form setup ---------- */
  const areas = Object.keys(D.places);
  const opts = areas.map((a) => `<option>${esc(a)}</option>`).join("");
  $("#fromSel").innerHTML = opts;
  $("#toSel").innerHTML = opts;
  $("#fromSel").value = "Union Square";
  $("#toSel").value = "Embarcadero / Ferry Building";
  const allTags = [...new Set(D.events.flatMap((e) => e.tags))].sort();
  $("#interestList").innerHTML = allTags.map((t) => `<option value="${esc(t)}">`).join("");

  $("#planForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const err = $("#formError");
    const input = {
      from: f.from, to: f.to,
      start: toMin(f.start || "00:00"), end: toMin(f.end || "00:00"), deadline: toMin(f.deadline || "00:00"),
      budget: Number(f.budget), food: f.food,
      interests: (f.interests || "").toLowerCase().split(/[,;]+/).map((s) => s.trim()).filter(Boolean)
    };
    let msg = "";
    if (!f.start || !f.end || !f.deadline) msg = "Please fill in all three times.";
    else if (input.end - input.start < 30) msg = "Your free window should be at least 30 minutes (end time must be after start time).";
    else if (input.deadline < input.start + 30) msg = "Your must-arrive-by time is too close to your start time.";
    else if (!(input.budget >= 0)) msg = "Enter a budget of $0 or more.";
    err.hidden = !msg; err.textContent = msg;
    if (msg) return;
    run(input);
  });

  /* ---------- processing ---------- */
  function run(input) {
    show("processing");
    const items = $$("#steps li");
    items.forEach((li) => (li.className = ""));
    let i = 0;
    const tick = () => {
      if (i > 0) items[i - 1].className = "done";
      if (i < items.length) { items[i].className = "active"; i++; setTimeout(tick, 650); }
      else {
        let plans;
        try { plans = recommend(input); } catch (err) { console.error(err); plans = null; }
        render(input, plans);
        show("results");
      }
    };
    tick();
  }

  /* ---------- recommendation engine ---------- */
  function evaluate(input, ev, r) {
    const mealMin = input.food === "quick" ? Math.min(r.quick, 25) : r.quick;
    const t1 = travel(input.from, r.area);
    const t2 = travel(r.area, ev.area);
    const t3 = travel(ev.area, input.to);
    const arriveRest = input.start + t1.min;
    const leaveRest = arriveRest + mealMin;
    const arriveEv = leaveRest + t2.min;
    const latestLeave = Math.min(input.end, input.deadline - t3.min);
    const attendStart = Math.max(arriveEv, ev.start);
    const attendEnd = Math.min(ev.end, latestLeave);
    const attended = Math.max(0, attendEnd - attendStart);
    const late = Math.max(0, arriveEv - latestLeave);
    const wait = Math.max(0, ev.start - arriveEv);
    const finalArrive = Math.max(attendEnd, arriveEv) + t3.min;
    const slack = input.deadline - finalArrive;
    const cost = r.cost + ev.cost;
    const over = Math.max(0, cost - input.budget);
    const travelTotal = t1.min + t2.min + t3.min;

    const dietOk = input.food === "none" || input.food === "quick" || r.diets.includes(input.food);
    const quickOk = input.food !== "quick" || r.quick <= 25;
    const matches = input.interests.filter((i) => ev.tags.some((t) => t.includes(i) || i.includes(t))).length;
    const interest = input.interests.length ? clamp((matches / input.interests.length) * 100) : 50;

    let fit = 100 - late * 3 - Math.max(0, 30 - attended) * 1.5 - wait * 0.25 - Math.min(30, over) - (slack < 0 ? -slack * 3 : 0) - (slack >= 0 && slack < 10 ? (10 - slack) * 0.8 : 0);
    fit = Math.round(clamp(fit));
    let conf = (ev.conf + r.conf) / 2 - (attended < 20 ? 8 : 0) - (late ? 10 : 0) - (!dietOk ? 15 : 0);
    conf = Math.round(clamp(conf));

    return { ev, r, mealMin, t1, t2, t3, arriveRest, leaveRest, arriveEv, attendStart, attendEnd, attended, late, wait, slack, cost, over, travelTotal, dietOk, quickOk, matches, interest, fit, conf, finalArrive,
      totalMin: finalArrive - input.start - t3.min < 0 ? 0 : attendEnd - input.start };
  }

  function recommend(input) {
    const pairs = [];
    D.events.forEach((ev) => D.restaurants.forEach((r) => pairs.push(evaluate(input, ev, r))));
    const penalty = (p) => (p.dietOk ? 0 : 60) + (p.quickOk ? 0 : 30) + (p.over > 0 ? 15 : 0) + (p.attended < 15 ? 40 : 0) + (p.late > 0 ? 50 : 0);

    const nets = (p) => 0.4 * p.ev.network + 0.35 * p.interest + 0.15 * p.fit + Math.min(p.attended, 90) * 0.1 - penalty(p);
    const food = (p) => 18 * p.r.rating + 0.3 * p.fit + (p.dietOk ? 10 : 0) - p.cost * 0.15 + Math.min(p.mealMin, 60) * 0.15 - penalty(p);
    const safe = (p) => p.fit + Math.min(Math.max(p.slack, 0), 30) * 0.9 - p.travelTotal * 0.6 + p.conf * 0.2 - penalty(p) + (p.attended >= 30 ? 5 : 0);

    const used = new Set(), usedEv = new Set();
    function pick(scoreFn) {
      const sorted = [...pairs].sort((a, b) => scoreFn(b) - scoreFn(a));
      const best = sorted.find((p) => !usedEv.has(p.ev.id) && !used.has(p.ev.id + p.r.id)) || sorted.find((p) => !used.has(p.ev.id + p.r.id)) || sorted[0];
      used.add(best.ev.id + best.r.id); usedEv.add(best.ev.id);
      return best;
    }
    return [
      { key: "network", title: "Best networking", icon: "🤝", blurb: "Highest-value room for your interests", plan: pick(nets) },
      { key: "food", title: "Best food", icon: "🍽️", blurb: "Top-rated meal that still fits", plan: pick(food) },
      { key: "safe", title: "Safest schedule", icon: "🛡️", blurb: "Biggest buffer, lowest risk of being late", plan: pick(safe) }
    ];
  }

  /* ---------- reasoning text ---------- */
  function reasoning(key, input, p) {
    const bits = [];
    if (key === "network") {
      bits.push(`${p.ev.name} rates ${p.ev.network}/100 for networking${p.matches ? ` and matches ${p.matches} of your interests` : ""}.`);
      bits.push(p.ev.why);
    } else if (key === "food") {
      bits.push(`${p.r.name} is rated ${p.r.rating}★ for ${p.r.cuisine.toLowerCase()}${input.food !== "none" && input.food !== "quick" && p.dietOk ? ` and works for a ${input.food} diet` : ""}.`);
      bits.push(p.r.why);
    } else {
      bits.push(`You'd have about ${Math.max(0, Math.round(p.slack))} minutes of buffer before your must-arrive time, with only ${p.travelTotal} minutes of total travel.`);
      bits.push(p.r.why);
    }
    if (p.late > 0) bits.push(`Heads up: you'd reach the event about ${Math.round(p.late)} min after you need to leave — consider a shorter meal.`);
    else if (p.wait > 10) bits.push(`The event starts ${Math.round(p.wait)} min after you arrive, so expect a short wait.`);
    if (p.over > 0) bits.push(`Total cost is $${p.over} over your budget.`);
    if (!p.dietOk) bits.push(`No close restaurant matched "${input.food}" exactly, so confirm options with the venue.`);
    return bits.join(" ");
  }

  function directionsUrl(input, p) {
    const sf = (s) => `${s}, San Francisco, CA`;
    const q = new URLSearchParams({
      api: "1",
      origin: sf(input.from),
      destination: sf(input.to),
      waypoints: [`${p.r.name}, ${p.r.area}, San Francisco, CA`, `${p.ev.venue}, San Francisco, CA`].join("|"),
      travelmode: "transit"
    });
    return "https://www.google.com/maps/dir/?" + q.toString();
  }

  /* ---------- results ---------- */
  function scoreClass(n) { return n >= 80 ? "good" : n >= 60 ? "ok" : "low"; }
  function meter(label, n) {
    return `<div class="meter ${scoreClass(n)}" title="${label}: ${n}/100">
      <div class="meter-top"><span>${label}</span><strong>${n}</strong></div>
      <div class="bar"><span style="width:${n}%"></span></div></div>`;
  }

  function render(input, plans) {
    const cards = $("#cards"), notice = $("#notice");
    if (!plans) {
      plans = recommend({ ...input, interests: [], food: "none", budget: 999 });
      notice.hidden = false;
      notice.textContent = "Something went wrong with live matching, so we're showing general sample picks.";
    } else {
      const anyLate = plans.some((x) => x.plan.late > 0 || x.plan.attended < 15);
      notice.hidden = !anyLate;
      notice.textContent = anyLate ? "Your window is tight, so some options are a stretch. Try widening your window or moving your must-arrive time later." : "";
    }
    $("#summary").textContent = `${input.from} → ${input.to} · free ${fmtTime(input.start)}–${fmtTime(input.end)} · arrive by ${fmtTime(input.deadline)} · budget $${input.budget}`;

    cards.innerHTML = plans.map(({ key, title, icon, blurb, plan: p }) => `
      <article class="card ${key}">
        <header class="card-head">
          <span class="badge">${icon} ${title}</span>
          <p class="muted">${blurb}</p>
        </header>
        <dl class="facts">
          <div><dt>Restaurant</dt><dd>${esc(p.r.name)}<small>${esc(p.r.cuisine)} · ${esc(p.r.area)} · ${p.mealMin} min</small></dd></div>
          <div><dt>Event</dt><dd>${esc(p.ev.name)}<small>${esc(p.ev.venue)} · ${fmtTime(p.ev.start)}–${fmtTime(p.ev.end)}</small></dd></div>
          <div class="row2">
            <div><dt>Travel time</dt><dd>${p.travelTotal} min<small>${p.t1.min} + ${p.t2.min} + ${p.t3.min} min legs</small></dd></div>
            <div><dt>Duration</dt><dd>${fmtDur(p.attended)} at event<small>${fmtTime(p.attendStart)}–${fmtTime(p.attendStart + p.attended)}</small></dd></div>
            <div><dt>Cost</dt><dd>${p.cost === 0 ? "Free" : "$" + p.cost}<small>meal $${p.r.cost} + event ${p.ev.cost ? "$" + p.ev.cost : "free"}</small></dd></div>
          </div>
        </dl>
        <div class="meters">${meter("Schedule fit", p.fit)}${meter("Confidence", p.conf)}</div>
        <div class="why"><h3>Why this plan</h3><p>${esc(reasoning(key, input, p))}</p></div>
        <p class="source">Source: <a href="${esc(p.ev.url)}" target="_blank" rel="noopener noreferrer">${esc(new URL(p.ev.url).hostname.replace("www.", ""))}</a> · <a href="${esc(p.r.url)}" target="_blank" rel="noopener noreferrer">Google Maps listing</a> <span class="sample">(sample data)</span></p>
        <div class="card-actions">
          <a class="btn primary" href="${esc(p.ev.url)}" target="_blank" rel="noopener noreferrer">View event</a>
          <a class="btn ghost" href="${esc(directionsUrl(input, p))}" target="_blank" rel="noopener noreferrer">Get directions</a>
        </div>
      </article>`).join("");
  }
})();
