import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'light-delay',
  discoveries: {
    'light-delay': {
      id: 'light-delay',
      label: 'The light delay',
      title: "Earth wouldn't notice for 8 minutes and 20 seconds.",
      status: 'established',
      explanation: [
        'Light is fast, but not instant. Sunlight crosses about 150 million km of space to reach us, and that trip takes roughly 8 minutes and 20 seconds.',
        'So if the Sun vanished, the light already on its way would keep arriving. The sky would stay blue and bright, as if nothing had happened.',
        'Then the last of the sunlight would arrive — and the daytime sky would go dark all at once.',
      ],
      highlight: {
        value: '8 min 20 s',
        label: 'How long sunlight takes to travel from the Sun to Earth',
        status: 'established',
        basis: 'Average Sun–Earth distance (149.6 million km) ÷ speed of light (299,792 km/s) ≈ 499 seconds.',
      },
      facts: [
        {
          status: 'established',
          text: "Changes in gravity also travel at the speed of light. Earth would keep orbiting an empty point for those same 8 minutes and 20 seconds before flying off in a straight line.",
        },
        {
          status: 'established',
          text: 'Moonlight is just reflected sunlight, so the Moon would go dark within seconds of the daytime sky.',
        },
        {
          status: 'inferred',
          text: 'Jupiter and Saturn would keep shining in the night sky for over an hour, lit by sunlight that was already on its way to them.',
        },
      ],
      visualization: {
        type: 'sunlight-delay',
        triggerLabel: 'Remove the Sun',
        scrubLabel: 'Minutes since the Sun disappeared',
        duration: 12,
        disclaimer: 'Visualization · distances to scale · time sped up 50×',
        description:
          'The Sun on the left and Mercury, Venus and Earth at their real relative distances to the right, with sunlight streaming between them. When the Sun is removed, a dark gap opens behind the last light ever emitted. That final wave of light keeps travelling outward: it passes Mercury after about 3 minutes, Venus after 6, and only reaches Earth after 8 minutes 20 seconds, when Earth finally goes dark.',
        captions: [
          { at: 0, text: 'Sunlight streams out continuously. Earth sees the Sun as it was minutes ago.' },
          { at: 0.001, text: 'The Sun is gone. Its last light is still travelling.' },
          { at: 0.33, text: 'Mercury goes dark after about 3 minutes.' },
          { at: 0.6, text: 'Venus goes dark after about 6 minutes.' },
          { at: 0.8, text: 'Earth is still in daylight…' },
          { at: 0.833, text: '8 min 20 s: the last sunlight reaches Earth.' },
        ],
      },
      choices: [
        {
          label: 'Where does Earth go?',
          description: 'Gravity’s last pull arrives with the last light. Follow Earth’s path once it stops.',
          next: 'earths-path',
        },
        {
          label: 'How fast does Earth cool?',
          description: 'The light is gone. Follow the heat stored in air, land and ocean as it leaks away.',
          next: 'the-cooling',
        },
      ],
    },

    'earths-path': {
      id: 'earths-path',
      label: 'Earth’s path',
      title: 'Earth would leave in a straight line at 30 km/s.',
      hook: 'An orbit is a fall that never lands. Remove what Earth is falling toward, and it simply keeps going.',
      status: 'established',
      explanation: [
        'Earth moves at about 29.8 km/s along its orbit. The Sun’s gravity is what bends that motion into a circle. Once the change in gravity reaches Earth — after the same 8 minutes and 20 seconds as the light — the bending stops.',
        'From then on Earth travels in a straight line, in whatever direction it happened to be moving. Every other planet does the same, each heading off on its own tangent. The Solar System comes apart like a released sling.',
        'The Moon would not be lost. It is bound to Earth far more tightly than to the Sun’s absence, and would keep orbiting us as we drift.',
      ],
      highlight: {
        value: '≈ 940 million km',
        label: 'How far Earth would travel in its first year without the Sun — about six times the Earth–Sun distance',
        status: 'established',
        basis: '29.8 km/s × 31.6 million seconds in a year ≈ 940 million km ≈ 6.3 AU.',
      },
      facts: [
        {
          status: 'established',
          text: 'In 2017, gravitational waves and light from the same neutron-star collision arrived within two seconds of each other after travelling 130 million years — strong evidence that gravity moves at the speed of light.',
        },
        {
          status: 'inferred',
          text: 'Planets farther out would leave more slowly: Jupiter at about 13 km/s, Neptune at about 5.4 km/s — their orbital speeds.',
        },
        {
          status: 'established',
          text: 'Interstellar space is mostly empty. The chance of Earth hitting another star or planet on its way out is extremely small.',
        },
      ],
      choices: [
        {
          label: 'What would the sky look like?',
          description: 'No sunlight, no moonlight, planets fading one by one. Follow the night.',
          next: 'night-sky',
        },
        {
          label: 'What survives?',
          description: 'Photosynthesis stops instantly. Follow the life that never needed the Sun.',
          next: 'what-survives',
        },
      ],
    },
    'the-cooling': {
      id: 'the-cooling',
      label: 'The cooling',
      title: 'The surface would cool fast. The deep ocean would hold out for a very long time.',
      hook: 'Earth doesn’t switch off with the Sun. It has stored heat — just not much of it at the surface.',
      status: 'inferred',
      explanation: [
        'Land and air have little stored heat. Without sunlight, published estimates suggest the average surface temperature would fall below freezing within about a week, and reach roughly −70 °C within a year.',
        'The oceans are different. Water stores enormous amounts of heat, and once ice forms on top it acts like a blanket, slowing further freezing dramatically.',
        'Beneath kilometres of ice, warmed slowly from below by Earth’s own interior, liquid water could persist for a very long time. The exact timescales are estimates, not measurements.',
      ],
      highlight: {
        value: '≈ 1 week',
        label: 'Rough estimate for the average surface temperature to drop below 0 °C',
        status: 'hypothetical',
      },
      facts: [
        {
          status: 'established',
          text: 'Per kilogram, water stores roughly four to five times as much heat as dry soil — one reason coastal climates swing less than inland ones.',
        },
        {
          status: 'established',
          text: 'Ice conducts heat poorly. A thicker ice lid makes each further centimetre slower to form.',
        },
        {
          status: 'hypothetical',
          text: 'Published figures for the cooling (a week to freeze, a year to about −70 °C) come from simple models and should be read as rough estimates.',
        },
      ],
      visualization: {
        type: 'timeline',
        triggerLabel: 'Run the clock',
        scrubLabel: 'Time since the Sun disappeared',
        duration: 10,
        disclaimer: 'Visualization · log time scale · later times are rough estimates',
        description:
          'A timeline on a logarithmic scale from seconds to thousands of years. Events: daylight ends after 8 minutes 20 seconds; the average surface temperature falls below freezing after roughly a week; it reaches roughly −70 °C after about a year; and the ocean surface freezes over while deep water stays liquid for thousands of years or more.',
        captions: [
          { at: 0, text: 'The Sun vanishes. Nothing changes yet.' },
          { at: 0.2, text: 'The last daylight arrives — and ends.' },
          { at: 0.55, text: 'Within days, the surface drops below freezing.' },
          { at: 0.95, text: 'The ice thickens. The deep ocean waits.' },
        ],
        params: {
          kind: 'timeline',
          scale: 'log',
          from: 60,
          to: 3.156e11,
          events: [
            { at: 499, label: 'Daylight ends', display: '8 min 20 s', status: 'established' },
            { at: 604_800, label: 'Surface average below 0 °C', display: '≈ 1 week', status: 'hypothetical' },
            { at: 31_557_600, label: 'Surface near −70 °C', display: '≈ 1 year', status: 'hypothetical' },
            { at: 3.156e10, label: 'Oceans iced over; deep water still liquid', display: 'Thousands of years', status: 'hypothetical' },
          ],
        },
      },
      choices: [
        {
          label: 'What would the sky look like?',
          description: 'A freezing world under the darkest sky humans have ever seen.',
          next: 'night-sky',
        },
        {
          label: 'What survives?',
          description: 'As the surface freezes, follow the life that runs on something other than sunlight.',
          next: 'what-survives',
        },
      ],
    },
    'night-sky': {
      id: 'night-sky',
      label: 'The night sky',
      title: 'The darkest sky humans have ever seen — and full of stars.',
      hook: 'Starlight left those stars years to millennia ago. None of it depends on our Sun.',
      status: 'inferred',
      explanation: [
        'After 8 minutes and 20 seconds the blue sky goes black. Moments later the Moon — which only shines by reflected sunlight — disappears too.',
        'The planets fade one by one as the last sunlight reflected from them reaches us. Jupiter and Saturn linger for more than an hour.',
        'Auroras would continue for a few days, powered by solar-wind particles already in flight. After that, only starlight remains: the Milky Way overhead, brighter than most people alive have ever seen it.',
      ],
      highlight: {
        value: '≈ 4 days',
        label: 'How long solar-wind particles already on their way would keep arriving — and keep auroras alive',
        status: 'inferred',
        basis: '150 million km ÷ a typical solar-wind speed of 400 km/s ≈ 375,000 s ≈ 4.3 days.',
      },
      facts: [
        {
          status: 'established',
          text: 'Stars are other suns. Their light is unaffected by what happens to ours.',
        },
        {
          status: 'established',
          text: 'Light pollution hides the Milky Way from roughly a third of humanity today.',
        },
        {
          status: 'inferred',
          text: 'The upper atmosphere’s faint “airglow”, powered by sunlight absorbed during the day, would fade within hours to days.',
        },
      ],
      visualization: {
        type: 'timeline',
        triggerLabel: 'Watch the sky',
        scrubLabel: 'Time since the Sun disappeared',
        duration: 9,
        disclaimer: 'Visualization · log time scale · times approximate',
        description:
          'A timeline on a logarithmic scale from one minute to one month. Daylight ends at 8 minutes 20 seconds, the Moon goes dark seconds later, Jupiter and Saturn fade after one to two hours, and the last auroras stop after about four days as the final solar wind arrives.',
        captions: [
          { at: 0, text: 'Daylight, for now.' },
          { at: 0.25, text: 'The day ends. The Moon goes with it.' },
          { at: 0.5, text: 'The planets fade from the night sky.' },
          { at: 0.9, text: 'The last auroras flicker out. Only stars remain.' },
        ],
        params: {
          kind: 'timeline',
          scale: 'log',
          from: 60,
          to: 2_629_800,
          events: [
            { at: 499, label: 'Daylight ends', display: '8 min 20 s', status: 'established' },
            { at: 501, label: 'Moon goes dark', display: '+ seconds', status: 'established' },
            { at: 5_400, label: 'Jupiter and Saturn fade', display: '≈ 1–2 hours', status: 'inferred' },
            { at: 375_000, label: 'Last auroras', display: '≈ 4 days', status: 'inferred' },
          ],
        },
      },
      conclusion: {
        title: 'Without the Sun, Earth becomes a dark wanderer — and the delay is its last gift.',
        summary: [
          'Everything the Sun gives us travels at the speed of light, including its gravity. So the first consequence is a pause: 8 minutes and 20 seconds of normal life.',
          'Then Earth flies off in a straight line, the sky empties of everything but stars, and the planet starts living on its stored heat. The surface freezes quickly; the deep oceans hold out far longer.',
        ],
        numbers: [
          { value: '8 min 20 s', label: 'Light and gravity delay', status: 'established', calculated: true },
          { value: '29.8 km/s', label: 'Earth’s speed as it leaves', status: 'established' },
          { value: '≈ 4 days', label: 'Until the last auroras', status: 'inferred', calculated: true },
        ],
        takeaway: 'We never see the Sun as it is — only as it was, a little over eight minutes ago.',
      },
    },
    'what-survives': {
      id: 'what-survives',
      label: 'What survives',
      title: 'Photosynthesis stops at once — but not all life depends on it.',
      hook: 'Almost every food chain on Earth begins with sunlight. Almost.',
      status: 'inferred',
      explanation: [
        'Plants, algae and photosynthetic bacteria would stop making food the moment the light ended. Everything that eats them — and everything that eats those — would follow over weeks to years as stores ran out and the cold set in.',
        'But some ecosystems run on chemical energy instead. Around deep-sea hydrothermal vents, microbes make food from compounds like hydrogen sulfide, and whole communities feed on them.',
        'There is a catch. Many vent animals still breathe oxygen dissolved in seawater — oxygen originally made by photosynthesis. The most independent survivors would be microbes living deep in rock, which need neither.',
      ],
      highlight: {
        value: '2.8 km',
        label: 'Depth in a South African gold mine where a bacterium was found living entirely on chemical energy, cut off from sunlight',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Hydrothermal vent ecosystems were discovered in 1977. Their food chains start with chemosynthesis, not photosynthesis.',
        },
        {
          status: 'established',
          text: 'Microbes have been found living kilometres below the surface, in rock and deep groundwater.',
        },
        {
          status: 'inferred',
          text: 'As the ocean’s dissolved oxygen is used up and not replaced, oxygen-breathing vent animals would struggle too.',
        },
      ],
      conclusion: {
        title: 'The Sun runs almost every food chain on Earth — and life still has a back door.',
        summary: [
          'The disappearance of the Sun is first a delay, then a navigation problem, then a heat problem. For life, it is an energy problem: photosynthesis is the entry point for nearly all the energy living things use.',
          'Life that runs on chemistry rather than light already exists, deep in the ocean and deep in rock. It would be the last part of the biosphere still working.',
        ],
        numbers: [
          { value: '8 min 20 s', label: 'Until photosynthesis stops everywhere', status: 'established', calculated: true },
          { value: '1977', label: 'Year vent ecosystems were discovered', status: 'established' },
          { value: '2.8 km', label: 'Depth of a sunlight-free bacterium', status: 'established' },
        ],
        takeaway: 'Sunlight is the main power supply for life on Earth, but not the only one.',
      },
    },
  },
};

export default content;
