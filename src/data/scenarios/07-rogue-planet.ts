import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'freeze-from-above',
  discoveries: {
    'freeze-from-above': {
      id: 'freeze-from-above',
      label: 'Freezing from above',
      title: "Cut off from the Sun, Earth's surface would freeze — from the top down.",
      status: 'inferred',
      explanation: [
        "Almost all the energy at Earth's surface comes from the Sun. The heat leaking out of Earth's hot interior is thousands of times smaller.",
        'As Earth drifted away, sunlight would fade with the square of the distance. Twice as far: a quarter of the light. Ten times as far: one hundredth.',
        'The oceans would freeze over from the surface down. But thick ice is a good insulator, and Earth’s internal heat would keep reaching the deep water from below.',
      ],
      highlight: {
        value: '≈ 3,700×',
        label: "More energy arrives from the Sun than flows out of Earth's hot interior",
        status: 'established',
        basis: 'Sunlight reaching Earth ≈ 173,000 terawatts. Heat flowing out of Earth’s interior ≈ 47 terawatts.',
      },
      facts: [
        {
          status: 'established',
          text: 'Rogue planets are real. Astronomers have detected planets drifting freely between the stars, and the galaxy may hold billions of them.',
        },
        {
          status: 'inferred',
          text: 'Eventually even the air would freeze. Nitrogen solidifies at about −210 °C, so after enough cooling the atmosphere itself would fall as snow.',
        },
        {
          status: 'hypothetical',
          text: 'Deep-sea hydrothermal vents could keep pockets of liquid water warm for a very long time. Whether life could hold on there is an open question.',
        },
      ],
      visualization: {
        type: 'rogue-orbit',
        triggerLabel: 'Eject Earth',
        scrubLabel: 'Years since Earth was ejected',
        duration: 16,
        disclaimer: 'Visualization · trajectory and temperatures are calculated',
        description:
          "A top-down view of the inner Solar System with Earth circling the Sun. After a hypothetical gravitational kick, Earth's path bends outward into an escape trajectory. The view zooms out past the orbits of Jupiter, Saturn and Neptune while the Sun shrinks to a point and the background darkens. Readouts track Earth's distance, how much sunlight it receives, and the temperature sunlight alone could sustain.",
        captions: [
          { at: 0, text: 'Earth circles the Sun once a year, about 150 million km out.' },
          { at: 0.005, text: 'A hypothetical kick — say, from a passing star — sends Earth faster than escape speed.' },
          { at: 0.1, text: 'Sunlight fades with the square of the distance.' },
          { at: 0.23, text: 'Past Saturn after about two years: sunlight is down to 1%.' },
          { at: 0.3, text: 'The temperature sunlight alone can sustain drops below −210 °C — cold enough to freeze nitrogen.' },
          { at: 0.9, text: 'Interstellar dark. The Sun is just another bright star.' },
        ],
      },
      choices: [
        {
          label: 'What happens to the oceans?',
          description: 'Follow the ice as it thickens — and the dark water trapped beneath it.',
          next: 'the-oceans',
        },
        {
          label: 'What happens to the air?',
          description: 'Follow the gases of the atmosphere as they cool past their freezing points.',
          next: 'the-air',
        },
      ],
    },

    'the-oceans': {
      id: 'the-oceans',
      label: 'The oceans',
      title: 'A lid of ice would seal the oceans — and slow its own growth.',
      hook: 'Ice floats, and ice insulates. Both matter enormously in the dark.',
      status: 'inferred',
      explanation: [
        'The oceans would freeze from the top down. Each new layer of ice makes the next one slower to form, because heat from the water below has to conduct through everything above it.',
        'Eventually the ice would stop thickening when the heat leaking up from Earth’s interior balances the heat escaping through the ice. A simple estimate puts that point at several kilometres of ice.',
        'That is comparable to the ocean’s average depth of 3.7 km. Whether liquid water survives beneath depends on details the simple estimate ignores — like salt, pressure and how ice conducts heat at very low temperatures.',
      ],
      highlight: {
        value: '≈ 5–6 km',
        label: 'Rough steady thickness of the ice lid, where Earth’s internal heat balances heat lost through the ice',
        status: 'hypothetical',
        basis: 'd = k·ΔT ÷ q, with ice conductivity k ≈ 2.2 W/m·K, a temperature drop ΔT ≈ 230 °C and geothermal heat flow q ≈ 0.09 W/m² → about 5.6 km.',
      },
      facts: [
        {
          status: 'established',
          text: 'Jupiter’s moon Europa is thought to hide a liquid ocean beneath an ice shell, kept warm by tidal heating rather than sunlight.',
        },
        {
          status: 'established',
          text: 'Heat flows out of Earth’s interior at an average of about 0.09 watts per square metre.',
        },
        {
          status: 'hypothetical',
          text: 'Whether Earth’s oceans would freeze solid or keep a liquid layer is genuinely uncertain.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Compare the ice',
        scrubLabel: 'Reveal the estimated ice thickness',
        duration: 6,
        disclaimer: 'Visualization · kilometres · ice estimates are rough',
        description:
          'A bar chart in kilometres. The ocean’s average depth is 3.7 km and the Mariana Trench about 11 km. A rough estimate of the steady ice lid on a rogue Earth is 5 to 6 km. Europa’s ice shell is estimated at roughly 15 to 25 km.',
        captions: [
          { at: 0, text: 'How deep the oceans go today.' },
          { at: 0.4, text: 'The ice lid on a rogue Earth: several kilometres.' },
          { at: 0.9, text: 'Europa, for comparison: an ocean under a thicker shell.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'kilometres',
          scale: 'linear',
          items: [
            { label: 'Average ocean depth', value: 3.7, display: '3.7 km', status: 'established' },
            { label: 'Mariana Trench', value: 11, display: '≈ 11 km', status: 'established' },
            { label: 'Rogue Earth ice lid (estimate)', min: 5, value: 6, display: '≈ 5–6 km', status: 'hypothetical', changed: true, calculated: true },
            { label: 'Europa’s ice shell (estimate)', min: 15, value: 25, display: '≈ 15–25 km', status: 'inferred', changed: true },
          ],
        },
      },
      choices: [
        {
          label: 'Could anything survive?',
          description: 'Under the ice, Earth’s own heat is the only power left. Follow life.',
          next: 'what-survives',
        },
        {
          label: 'Would anyone ever see us?',
          description: 'A frozen, dark planet between the stars. Follow how it might be found.',
          next: 'being-seen',
        },
      ],
    },
    'the-air': {
      id: 'the-air',
      label: 'The air',
      title: 'The sky would fall as snow, one gas at a time.',
      hook: 'Air is a mixture of gases that each freeze at their own temperature.',
      status: 'inferred',
      explanation: [
        'Water vapour goes first, freezing out at 0 °C. Carbon dioxide follows, turning straight to frost at about −78 °C.',
        'Oxygen and nitrogen — 99% of the air — need far colder conditions. Oxygen condenses at about −183 °C and nitrogen at about −196 °C, freezing solid at −210 °C.',
        'As each gas freezes onto the ground, the air gets thinner and the surface pressure drops. Eventually most of the atmosphere would lie on the ground as a layer of ice and snow some metres thick.',
      ],
      highlight: {
        value: '−210 °C',
        label: 'Temperature at which nitrogen — 78% of the air — freezes solid',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Pluto’s surface is covered in nitrogen ice at around −230 °C.',
        },
        {
          status: 'established',
          text: 'Carbon dioxide frost forms on Mars every winter, at its poles.',
        },
        {
          status: 'hypothetical',
          text: 'How long the atmosphere would take to freeze out depends on how much internal heat leaks through the surface.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Cool the air',
        scrubLabel: 'Reveal each gas as it freezes',
        duration: 8,
        disclaimer: 'Visualization · temperatures in kelvin (0 K = absolute zero) · at normal pressure',
        description:
          'A chart of temperatures in kelvin at which the main gases of the air freeze or condense. Water freezes at 273 K (0 °C). Carbon dioxide frosts at 195 K (−78 °C). Oxygen condenses at 90 K (−183 °C). Nitrogen condenses at 77 K (−196 °C) and freezes at 63 K (−210 °C).',
        captions: [
          { at: 0, text: 'Water freezes first.' },
          { at: 0.3, text: 'Carbon dioxide turns to frost.' },
          { at: 0.9, text: 'Finally oxygen and nitrogen — the air itself.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'kelvin',
          scale: 'linear',
          items: [
            { label: 'Water freezes', value: 273, display: '273 K · 0 °C', status: 'established' },
            { label: 'Carbon dioxide frosts', value: 195, display: '195 K · −78 °C', status: 'established', changed: true },
            { label: 'Oxygen condenses', value: 90, display: '90 K · −183 °C', status: 'established', changed: true },
            { label: 'Nitrogen condenses', value: 77, display: '77 K · −196 °C', status: 'established', changed: true },
            { label: 'Nitrogen freezes', value: 63, display: '63 K · −210 °C', status: 'established', changed: true },
          ],
        },
      },
      choices: [
        {
          label: 'Could anything survive?',
          description: 'With the air frozen on the ground, follow the last warm places.',
          next: 'what-survives',
        },
        {
          label: 'Would anyone ever see us?',
          description: 'A planet without light or air. Follow how astronomers find such worlds.',
          next: 'being-seen',
        },
      ],
    },
    'what-survives': {
      id: 'what-survives',
      label: 'What survives',
      title: 'Life could hold on only where Earth’s own heat reaches.',
      hook: 'Earth has a second, much weaker power source: the heat inside it.',
      status: 'hypothetical',
      explanation: [
        'Earth’s interior is still hot from its formation and from radioactive elements decaying in the rock. That heat leaks out at about 47 terawatts — tiny compared with sunlight, but steady for billions of years.',
        'Hydrothermal vents on the sea floor already host life that runs on chemical energy. Microbes live kilometres down in rock. These ecosystems don’t need sunlight.',
        'The question for a rogue Earth is whether liquid water and enough chemical energy would remain beneath the ice, and for how long. Some researchers have argued that rogue planets could keep habitable pockets; others are more doubtful.',
      ],
      highlight: {
        value: '≈ 47 TW',
        label: 'Heat flowing out of Earth’s interior — the power that would remain after the Sun',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'About half of Earth’s internal heat comes from the radioactive decay of uranium, thorium and potassium.',
        },
        {
          status: 'established',
          text: 'Deep-sea vent communities are built on microbes that make food from chemicals like hydrogen sulfide.',
        },
        {
          status: 'hypothetical',
          text: 'Whether a rogue Earth could sustain life for millions of years is an open research question.',
        },
      ],
      conclusion: {
        title: 'A rogue Earth runs on its own heat — barely.',
        summary: [
          'Cut loose from the Sun, Earth loses more than 99.9% of its surface energy. The oceans freeze from the top, the atmosphere falls as snow, and the surface settles toward the temperature its weak internal heat allows.',
          'What remains is a slow, dim power source from inside the planet. If life holds on, it will be in the dark, near that heat.',
        ],
        numbers: [
          { value: '≈ 3,700×', label: 'Sunlight’s power compared with Earth’s internal heat', status: 'established', calculated: true },
          { value: '≈ 47 TW', label: 'Heat that would remain', status: 'established' },
          { value: '−210 °C', label: 'Where the air itself freezes', status: 'established' },
        ],
        takeaway: 'Without a star, a planet is left with only the heat it was born with.',
      },
    },
    'being-seen': {
      id: 'being-seen',
      label: 'Being seen',
      title: 'A frozen Earth would be nearly invisible — except by its gravity.',
      hook: 'A planet with no star doesn’t shine. So how do astronomers find them?',
      status: 'established',
      explanation: [
        'A rogue Earth would emit only faint infrared from its cold surface — far too weak to spot from another star system with today’s technology.',
        'Astronomers find rogue planets another way: gravitational microlensing. When a planet passes almost exactly in front of a distant star, its gravity bends and briefly brightens that star’s light.',
        'For an Earth-mass planet, that brightening lasts under an hour. Surveys watching millions of stars have caught a handful of such events — including at least one candidate as small as Earth.',
      ],
      highlight: {
        value: '≈ 42 min',
        label: 'Duration of the microlensing flash from the smallest rogue-planet candidate yet found — possibly Earth-sized or smaller',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Microlensing doesn’t need the planet to emit any light at all — only mass.',
        },
        {
          status: 'established',
          text: 'NASA’s Nancy Grace Roman Space Telescope is designed in part to find hundreds of free-floating planets this way.',
        },
        {
          status: 'inferred',
          text: 'Each microlensing event happens once: the alignment is never repeated, so the planet is seen and then lost.',
        },
      ],
      conclusion: {
        title: 'A rogue Earth would vanish from view — and become one of billions.',
        summary: [
          'Without the Sun, Earth goes dark, cold and quiet, keeping only the heat of its own interior. Its oceans seal under ice; its air freezes onto the ground.',
          'From outside it would be almost undetectable, noticed only if its gravity happened to briefly magnify a distant star. Astronomers think the galaxy may already be full of worlds like that.',
        ],
        numbers: [
          { value: '≈ 42 min', label: 'Microlensing flash from an Earth-mass rogue', status: 'established' },
          { value: '≈ 255 K', label: 'Sunlight-only temperature at 1 AU — and it falls with distance', status: 'established', calculated: true },
          { value: 'Billions', label: 'Estimated rogue planets in the Milky Way', status: 'inferred' },
        ],
        takeaway: 'Rogue planets are found not by their light, but by how they bend someone else’s.',
      },
    },
  },
};

export default content;
