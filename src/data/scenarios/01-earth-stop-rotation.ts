import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'ground-stops',
  discoveries: {
    'ground-stops': {
      id: 'ground-stops',
      label: 'The ground stops',
      title: "The ground stops. The air and oceans don't.",
      status: 'inferred',
      explanation: [
        "Earth's atmosphere and oceans aren't bolted to the planet. They ride along only because they're already moving at the same speed as the ground beneath them.",
        'Stop the ground suddenly and everything loose keeps going east — at up to 1,670 km/h at the equator. That is about four times faster than the strongest gust of wind ever measured.',
        'Over much longer timescales the water would rearrange itself too. Spin is what lets the oceans pile up at the equator. Without it, gravity would slowly pull that water toward the poles.',
      ],
      highlight: {
        value: '1,670 km/h',
        label: 'Speed of the air relative to the ground at the equator, the moment the ground stops',
        status: 'inferred',
        basis: "Earth's circumference at the equator (40,075 km) ÷ one rotation (23.9 hours).",
      },
      facts: [
        {
          status: 'established',
          text: "Spin makes Earth bulge: the equator sits about 21 km farther from Earth's centre than the poles do.",
        },
        {
          status: 'established',
          text: 'A "day" would last a whole year. Earth would still orbit the Sun, so each side would get roughly six months of daylight followed by six months of night.',
        },
        {
          status: 'inferred',
          text: 'Over long timescales the oceans would drain toward the poles, leaving one continuous belt of land wrapped around the equator.',
        },
        {
          status: 'hypothetical',
          text: 'Exactly how weather, climate and life would reorganise afterwards cannot be predicted with confidence.',
        },
      ],
      visualization: {
        type: 'earth-rotation',
        triggerLabel: 'Stop the rotation',
        scrubLabel: "Progress of Earth's rotation stopping",
        duration: 14,
        disclaimer: 'Visualization · time compressed · ocean thickness exaggerated',
        description:
          'A globe seen from the side, with lines of longitude showing its spin and streaks showing the air moving with it. The globe slows to a stop while the air streaks keep racing east. Then a thick ocean layer, drawn exaggerated around the globe, drains from the equator toward the north and south poles.',
        captions: [
          { at: 0, text: 'Earth turns once a day. Ground, air and ocean all move together.' },
          { at: 0.04, text: 'The rotation is slowing…' },
          { at: 0.34, text: "The ground has stopped. The air hasn't." },
          { at: 0.6, text: 'Much later: the oceans drift toward the poles.' },
          { at: 0.93, text: 'Two polar oceans. One equatorial super-continent.' },
        ],
      },
      choices: [
        {
          label: 'What happens to the air?',
          description: 'Follow the atmosphere as it keeps racing east at up to 1,670 km/h over a ground that has stopped.',
          next: 'the-air',
        },
        {
          label: 'What happens to the oceans?',
          description: 'Follow the water as the equatorial bulge loses the spin that was holding it up.',
          next: 'the-oceans',
        },
      ],
    },

    'the-air': {
      id: 'the-air',
      label: 'The air',
      title: 'For a while, the wind would be faster than sound.',
      hook: 'The ground has stopped. Everything above it is still moving at the old speed.',
      status: 'inferred',
      explanation: [
        'At the equator the air would be moving about 465 metres per second relative to the ground. The speed of sound near the surface is about 343 m/s. The lowest layer of the atmosphere would be crossing the land faster than sound.',
        'The effect weakens toward the poles, because the ground there was never moving as fast. At the latitude of London the difference is about 1,040 km/h; near the poles it is close to nothing.',
        'Friction with the surface would eventually drag the air to a halt, turning its motion into heat and turbulence. How long that takes — hours or days — is beyond a simple estimate.',
      ],
      highlight: {
        value: '≈ Mach 1.4',
        label: 'Air speed relative to the ground at the equator, compared with the speed of sound',
        status: 'inferred',
        basis: '465 m/s (equatorial rotation speed) ÷ 343 m/s (speed of sound at 20 °C) ≈ 1.36.',
      },
      facts: [
        {
          status: 'established',
          text: 'Ground speed from rotation shrinks with latitude: 1,670 km/h × cos(latitude). That is about 1,040 km/h at London and about 0 at the poles.',
        },
        {
          status: 'established',
          text: 'The fastest wind gust ever measured outside a tornado was 408 km/h, on Barrow Island, Australia, in 1996.',
        },
        {
          status: 'hypothetical',
          text: 'How much damage the first hours would do, and how quickly the atmosphere would settle, depends on details no simple model captures.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Compare the winds',
        scrubLabel: 'Reveal the wind speeds after the stop',
        duration: 6,
        disclaimer: 'Visualization · values calculated or measured · linear scale',
        description:
          'A bar chart of wind speeds in kilometres per hour. Reference bars show a category 5 hurricane at 252 km/h and the strongest measured gust at 408 km/h. Bars for the stopped Earth then grow in: about 1,040 km/h at London’s latitude and about 1,670 km/h at the equator, above the speed of sound at about 1,235 km/h.',
        captions: [
          { at: 0, text: 'The strongest winds ever measured, for scale.' },
          { at: 0.1, text: 'Now the air over a stopped Earth…' },
          { at: 0.9, text: 'At the equator, faster than sound.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'km/h',
          scale: 'linear',
          items: [
            { label: 'Category 5 hurricane (sustained)', value: 252, display: '≥ 252 km/h', status: 'established' },
            { label: 'Strongest measured gust', value: 408, display: '408 km/h', status: 'established' },
            { label: 'Speed of sound', value: 1235, display: '≈ 1,235 km/h', status: 'established' },
            { label: 'Stopped Earth, at London', value: 1040, display: '≈ 1,040 km/h', status: 'inferred', changed: true, calculated: true },
            { label: 'Stopped Earth, at the equator', value: 1670, display: '≈ 1,670 km/h', status: 'inferred', changed: true, calculated: true },
          ],
        },
      },
      choices: [
        {
          label: 'What does a year-long day do to the weather?',
          description: 'Once the wind dies down, the Sun stops crossing the sky. Follow the heat.',
          next: 'year-long-day',
        },
        {
          label: 'What happens to life’s daily rhythm?',
          description: 'Nearly every living thing keeps time by the 24-hour day. Follow the clocks.',
          next: 'body-clocks',
        },
      ],
    },
    'the-oceans': {
      id: 'the-oceans',
      label: 'The oceans',
      title: 'The oceans would slowly slide toward the poles.',
      hook: 'Spin is what lets the water pile up around the equator. Take it away and the pile has nowhere to stay.',
      status: 'inferred',
      explanation: [
        'Earth’s rotation flings the planet outward at the equator. The solid Earth bulges by about 21 km, and the oceans bulge with it.',
        'Without rotation, the only thing shaping the water is gravity — and gravity pulls toward the centre. The water at the equator would be sitting on a hill with nothing holding it there. It would flow toward the poles.',
        'Mapping studies of this scenario suggest two great polar oceans and a single continent wrapped around the equator. The rock would also slowly lose its bulge, but rock flows over thousands of years or more, not days.',
      ],
      highlight: {
        value: '21 km',
        label: 'How much farther the equator is from Earth’s centre than the poles — the height of the “hill” the water would slide off',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Earth’s equatorial radius is about 6,378 km; its polar radius is about 6,357 km.',
        },
        {
          status: 'inferred',
          text: 'Ocean water responds in weeks to months; the solid Earth’s shape adjusts far more slowly, over thousands of years or longer.',
        },
        {
          status: 'hypothetical',
          text: 'The exact coastlines of the new polar oceans depend on how far the rock rebounds, which is uncertain.',
        },
      ],
      choices: [
        {
          label: 'What does a year-long day do to the weather?',
          description: 'With the water rearranged, follow what happens when the Sun stays put for months.',
          next: 'year-long-day',
        },
        {
          label: 'What happens to life’s daily rhythm?',
          description: 'New coasts, new seas — and no 24-hour day to keep time by.',
          next: 'body-clocks',
        },
      ],
    },
    'year-long-day': {
      id: 'year-long-day',
      label: 'A year-long day',
      title: 'One side bakes for six months while the other freezes.',
      hook: 'Earth still orbits the Sun. So the Sun still rises and sets — once a year.',
      status: 'inferred',
      explanation: [
        'Today, spin spreads sunlight evenly: every place gets a short dose of day and a short dose of night. Without spin, the Sun would hang in nearly the same spot in the sky for weeks.',
        'The day side would heat up for months; the night side would radiate its heat to space for months. The atmosphere would try to even this out, with air rising on the hot side and flowing toward the cold side.',
        'Climate models of slowly rotating planets show exactly this kind of single, planet-wide circulation. How hot and how cold Earth would get depends on clouds and oceans, and is genuinely uncertain.',
      ],
      highlight: {
        value: '≈ 6 months',
        label: 'Of continuous daylight at any one place, followed by about six months of night',
        status: 'established',
        basis: 'With no rotation, one solar day lasts one orbit: about 365 days, half lit and half dark.',
      },
      facts: [
        {
          status: 'established',
          text: 'Venus turns once every 243 Earth days, yet its very thick atmosphere keeps day and night sides at almost the same temperature, around 460 °C.',
        },
        {
          status: 'inferred',
          text: 'Earth’s much thinner air carries far less heat, so its day–night contrast would be much larger than Venus’s.',
        },
        {
          status: 'hypothetical',
          text: 'Exact surface temperatures depend on cloud cover, which could shade the day side heavily. Estimates vary widely.',
        },
      ],
      visualization: {
        type: 'timeline',
        triggerLabel: 'Play one day',
        scrubLabel: 'Time through one year-long day',
        duration: 10,
        disclaimer: 'Visualization · one location · times approximate',
        description:
          'A timeline covering one year, which is now one day. Sunrise at the start, the Sun highest after about three months, sunset after about six months, deepest night after about nine months, and the next sunrise after a year.',
        captions: [
          { at: 0, text: 'Sunrise. The Sun begins its slow climb.' },
          { at: 0.25, text: 'Noon — three months later.' },
          { at: 0.5, text: 'Sunset, after six months of light.' },
          { at: 0.95, text: 'A full day: one entire orbit of the Sun.' },
        ],
        params: {
          kind: 'timeline',
          scale: 'linear',
          from: 0,
          to: 31_557_600,
          events: [
            { at: 0, label: 'Sunrise', display: 'Day 0', status: 'established' },
            { at: 7_889_400, label: 'Sun at its highest', display: '≈ 3 months', status: 'established' },
            { at: 15_778_800, label: 'Sunset', display: '≈ 6 months', status: 'established' },
            { at: 23_668_200, label: 'Deepest night', display: '≈ 9 months', status: 'established' },
            { at: 31_557_600, label: 'Next sunrise', display: '≈ 1 year', status: 'established' },
          ],
        },
      },
      conclusion: {
        title: 'Earth’s spin is a climate system in its own right.',
        summary: [
          'Stopping the rotation doesn’t just end the 24-hour day. It unleashes the momentum stored in the air and oceans, then removes the daily mixing that keeps every place from overheating or freezing.',
          'The violent part — supersonic winds — is short. The lasting part is a planet with one long hot season and one long cold season everywhere at once, organised by a single day–night circulation.',
        ],
        numbers: [
          { value: '1,670 km/h', label: 'Equator’s rotation speed — and the initial wind', status: 'established', calculated: true },
          { value: '≈ 6 months', label: 'Of daylight, then of night, at any place', status: 'established' },
          { value: '21 km', label: 'Equatorial bulge the oceans would slide off', status: 'established' },
        ],
        takeaway: 'Spin is what turns sunlight into weather we can live with.',
      },
    },
    'body-clocks': {
      id: 'body-clocks',
      label: 'Body clocks',
      title: 'Every body clock on Earth would lose its reference.',
      hook: 'Bacteria, plants, insects and people all keep time to a 24-hour day. That day would be gone.',
      status: 'inferred',
      explanation: [
        'Most living things run on internal circadian clocks that tick roughly once every 24 hours and are reset each morning by light. They time sleep, hormones, feeding, flowering and even cell division.',
        'With a day that lasts a year, the morning reset would arrive once every twelve months. Internal clocks would drift out of step with each other and with the world.',
        'Life is not helpless here. Animals in the Arctic already live through months of continuous light or dark, and some of them simply switch their daily rhythms off.',
      ],
      highlight: {
        value: '≈ 24 h',
        label: 'The period of circadian clocks found in organisms from single-celled bacteria to humans',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Even cyanobacteria — single cells — keep a 24-hour clock built from just three proteins.',
        },
        {
          status: 'established',
          text: 'Reindeer in the high Arctic show little daily rhythm during the months of midnight sun and polar night.',
        },
        {
          status: 'hypothetical',
          text: 'Which species could adapt, and how quickly, is unknowable. Pollinators and the flowers they visit, for instance, rely on being active at the same time of day.',
        },
      ],
      conclusion: {
        title: 'The 24-hour day is built into life itself.',
        summary: [
          'A stopped Earth is first a physics problem — winds and water still carrying the old motion. Then it becomes a biology problem: nearly every organism is wired to a 24-hour cycle that no longer exists.',
          'Some life already copes with months of light and dark near the poles, which hints at how adaptation might begin. But whole ecosystems synchronised by the daily cycle would fall out of step.',
        ],
        numbers: [
          { value: '≈ 24 h', label: 'Period of circadian clocks across life', status: 'established' },
          { value: '≈ 365 days', label: 'Length of one day on a non-rotating Earth', status: 'established', calculated: true },
          { value: '3 proteins', label: 'All a cyanobacterium needs to keep a daily clock', status: 'established' },
        ],
        takeaway: 'Rotation sets the rhythm that almost every living thing keeps time to.',
      },
    },
  },
};

export default content;
