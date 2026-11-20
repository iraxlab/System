/* IRA X LAB · small line drawings for lesson blocks · 64 × 64 · brand colours only */
(function () {
  var K = '#000', B = '#AA976C', P = '#C0C0C0';
  var BR = 'M12 34C10 20 22 10 34 10c12 0 20 8 20 18 0 8-5 14-12 15-4 4-12 5-17 3-6 1-11-2-13-5z';
  var I = {
    lost: '<path d="M8 54c8-6 4-14 12-16s10 6 16 2 2-12 10-14" stroke="' + K + '" stroke-dasharray="3 5"/><path d="M46 12a6 6 0 1 1 6 6v4" stroke="' + B + '"/><circle cx="52" cy="28" r="1.8" fill="' + B + '" stroke="none"/>',
    lump: '<path d="' + BR + '"/><circle cx="33" cy="28" r="7" fill="' + B + '" stroke="none"/>',
    place: '<path d="M10 32L32 14l22 18M16 28v24h32V28"/><path d="M38 40a6 6 0 1 0-12 0c0 6 6 12 6 12s6-6 6-12z" fill="' + B + '" stroke="none"/>',
    bike: '<circle cx="16" cy="40" r="10"/><circle cx="48" cy="40" r="10"/><path d="M16 40l10-16h14l8 16M26 24l6 16 8-16M22 20h8M40 24l-2-6h6" />',
    phone: '<rect x="20" y="8" width="24" height="48" rx="4"/><path d="M38 28a6 6 0 1 0-12 0c0 5 6 10 6 10s6-5 6-10z" fill="' + B + '" stroke="none"/><path d="M28 50h8"/>',
    parts: '<path d="' + BR + '"/><path d="M30 10c-4 8 2 14-2 22M14 30c8-2 16 0 24-4M40 12c-2 10 2 16 0 24" stroke="' + P + '"/><circle cx="22" cy="22" r="4" fill="' + B + '" stroke="none"/>',
    target: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="13" stroke="' + P + '"/><circle cx="32" cy="32" r="5" fill="' + B + '" stroke="none"/>',
    mirror: '<path d="' + BR + '" transform="translate(-4 2) scale(.7)"/><path d="M30 26h10M36 22l4 4-4 4" stroke="' + B + '"/><circle cx="50" cy="20" r="6"/><path d="M42 44c2-8 14-8 16 0"/>',
    grow: '<path d="M32 56V28"/><path d="M32 36c-10 0-16-6-16-14 10 0 16 6 16 14zM32 30c0-10 8-16 18-16 0 10-8 16-18 16z" fill="' + B + '" stroke="none"/><path d="M18 56h28"/>',
    brainyou: '<path d="M22 56V46c-6-4-10-10-10-18 0-12 10-20 22-20s20 8 20 18c0 4-2 6-4 8l4 8h-6v6c0 4-4 6-8 6h-4v2"/><circle cx="32" cy="26" r="8" fill="' + B + '" stroke="none"/>',
    lenses: '<circle cx="26" cy="26" r="14"/><path d="M36 36l16 16" stroke="' + B + '" stroke-width="4"/>',
    quiz: '<path d="M10 14h44v28H30l-10 10V42H10z"/><path d="M28 24a4 4 0 1 1 4 4v3" stroke="' + B + '"/><circle cx="32" cy="36" r="1.8" fill="' + B + '" stroke="none"/>',
    scan: '<circle cx="26" cy="30" r="18"/><circle cx="26" cy="30" r="9" stroke="' + P + '"/><path d="M12 50h46M26 39v11" /><rect x="34" y="27" width="22" height="6" fill="' + B + '" stroke="none"/>',
    movie: '<rect x="8" y="16" width="48" height="32" rx="3"/><path d="M28 24v16l12-8z" fill="' + B + '" stroke="none"/><path d="M8 22h48M8 42h48" stroke="' + P + '"/>',
    person: '<circle cx="32" cy="18" r="8"/><path d="M18 56c0-14 6-22 14-22s14 8 14 22"/><path d="M40 14l6-4" stroke="' + B + '"/>',
    waves: '<path d="M6 32l6-10 6 20 6-26 6 30 6-22 6 14 6-8 6 4 6-2"/><path d="M6 50h52" stroke="' + B + '"/>',
    wires: '<circle cx="14" cy="18" r="5"/><circle cx="50" cy="16" r="5"/><circle cx="32" cy="48" r="5" fill="' + B + '" stroke="none"/><path d="M18 20l10 24M46 20L36 44M19 18h26" stroke="' + P + '"/>',
    dots: Array.apply(null, Array(25)).map(function (_, i) { return '<circle cx="' + (12 + (i % 5) * 10) + '" cy="' + (12 + Math.floor(i / 5) * 10) + '" r="2.4" fill="' + (i === 12 ? B : K) + '" stroke="none"/>'; }).join(''),
    link: '<circle cx="20" cy="32" r="8"/><circle cx="44" cy="20" r="6"/><circle cx="46" cy="46" r="6"/><circle cx="52" cy="32" r="4"/><path d="M27 28l11-6M27 36l13 8M28 32h20" stroke="' + B + '"/>',
    bolt: '<path d="M36 6L16 36h14l-4 22 22-32H34z" fill="' + B + '" stroke="' + K + '"/>',
    pizza: '<circle cx="32" cy="32" r="24"/><path d="M32 8v48M8 32h48M15 15l34 34M49 15L15 49" stroke="' + P + '"/><circle cx="24" cy="22" r="3" fill="' + B + '" stroke="none"/><circle cx="40" cy="40" r="3" fill="' + B + '" stroke="none"/>',
    cables: '<path d="M8 20c16 0 16 24 48 24M8 28c16 0 16 16 48 16M8 36c16 0 16 8 48 8" /><path d="M8 44c16 0 16 0 48 0" stroke="' + B + '"/>',
    microscope: '<path d="M26 10l10 4-8 20-10-4z"/><path d="M30 34c10 0 16 6 16 14M14 56h36M22 48h20"/><circle cx="33" cy="12" r="2.5" fill="' + B + '" stroke="none"/>',
    eyeM: '<path d="M6 32c8-12 16-18 26-18s18 6 26 18c-8 12-16 18-26 18S14 44 6 32z"/><path d="M24 40V26l8 8 8-8v14" stroke="' + B + '"/>',
    handmap: '<path d="M22 58V36l-6-12a4 4 0 0 1 7-3l5 10V12a4 4 0 0 1 8 0v18V8a4 4 0 0 1 8 0v22l4-6a4 4 0 0 1 7 4l-8 18v12"/>' + [[32, 10], [44, 7], [20, 22], [56, 26]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + B + '" stroke="none"/>'; }).join(''),
    piano: '<rect x="8" y="16" width="48" height="32"/><path d="M16 16v32M24 16v32M32 16v32M40 16v32M48 16v32" stroke="' + P + '"/><path d="M14 16h4v18h-4zM22 16h4v18h-4zM38 16h4v18h-4zM46 16h4v18h-4z" fill="' + K + '"/><path d="M10 54c10-4 34-4 44-12" stroke="' + B + '"/>',
    memory: '<path d="M32 32a4 4 0 1 1 4 4 8 8 0 1 1-8-8 12 12 0 1 1 12 12 16 16 0 1 1-16-16"/><circle cx="32" cy="32" r="2.5" fill="' + B + '" stroke="none"/>',
    paint: '<path d="M44 8l12 12-22 22-12-12z"/><path d="M22 30c-8 0-12 6-12 12 0 6-4 10-4 10 10 2 22-2 22-12" fill="' + B + '" stroke="' + K + '"/>',
    almond: '<path d="M32 8c14 10 18 32 0 48C14 40 18 18 32 8z" fill="' + B + '" stroke="' + K + '"/><path d="M32 16c4 10 4 22 0 32" stroke="' + K + '" stroke-opacity=".4"/>',
    cauli: '<circle cx="22" cy="26" r="9"/><circle cx="36" cy="20" r="10"/><circle cx="46" cy="32" r="8"/><circle cx="30" cy="36" r="9"/><path d="M26 44l6 12 6-12" stroke="' + B + '"/>',
    film: '<rect x="6" y="12" width="52" height="22"/><path d="M19 12v22M32 12v22M45 12v22" stroke="' + P + '"/><path d="M22 42h20l-3 16H25z"/><path d="M24 46h16" stroke="' + B + '"/><path d="M28 38c0 2 2 4 2 6M36 36c0 3 1 5 1 8" stroke="' + B + '"/>'
  };
  window.ICON = function (name) {
    var b = I[name]; if (!b) return '';
    return '<svg class="ico" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + b + '</svg>';
  };
})();
