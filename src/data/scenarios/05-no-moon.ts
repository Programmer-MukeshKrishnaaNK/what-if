import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'tides-shrink',
  discoveries: {
    'tides-shrink': {
      id: 'tides-shrink',
      label: 'The tides',
      title: "Without the Moon, the tides would shrink to a fraction of today's.",
      status: 'established',
      explanation: [
        'Tides happen because gravity weakens with distance. The Moon pulls harder on the side of Earth facing it than on the far side, stretching the oceans into two bulges.',
        'The Sun does the same thing, but it is so far away that its stretching effect is less than half the Moon’s — even though it is 27 million times more massive.',
        "Take the Moon away and only the Sun's tide is left: smaller, steadier, and arriving every 12 hours instead of every 12 hours and 25 minutes.",
      ],
      highlight: {
        value: '46%',
        label: "The Sun's tide-raising pull compared with the Moon's",
        status: 'established',
        basis: 'Tidal stretching ∝ mass ÷ distance³. Sun: 1.99×10³⁰ kg at 149.6 million km. Moon: 7.35×10²² kg at 384,400 km.',
      },
      facts: [
        {
          status: 'established',
          text: 'Spring and neap tides would disappear. That monthly swing comes from the Sun and Moon lining up, then pulling at right angles.',
        },
        {
          status: 'established',
          text: 'The Moon is drifting away by about 3.8 cm a year, so its tides are already weakening — very, very slowly.',
        },
        {
          status: 'hypothetical',
          text: "The Moon helps steady the tilt of Earth's axis. Without it the tilt might wander far more over millions of years — but how much is still debated.",
        },
      ],
      visualization: {
        type: 'lunar-tides',
        triggerLabel: 'Remove the Moon',
        scrubLabel: "How much of the Moon's pull has been removed",
        duration: 9,
        disclaimer: 'Visualization · tide heights exaggerated · tide ratio is calculated',
        description:
          "Earth seen from above the North Pole, with the ocean drawn as a stretched layer around it. The Moon orbits and pulls the ocean into two bulges that follow it, while the Sun to the left adds a smaller pair of bulges. A tide chart below plots sea level at one coastline over two days. When the Moon is removed, the bulges shrink to the Sun's smaller ones and the tide chart flattens to about a third of its peak height.",
        captions: [
          { at: 0, text: 'The Moon stretches the oceans into two bulges. Earth spins through them.' },
          { at: 0.05, text: "The Moon's pull is fading…" },
          { at: 0.55, text: 'The Sun now dominates the tides.' },
          { at: 0.97, text: 'Only the Sun’s tide remains: small, steady, every 12 hours.' },
        ],
      },
      choices: [
        {
          label: 'What happens to Earth’s tilt?',
          description: 'The Moon helps hold Earth’s axis steady. Follow the seasons over millions of years.',
          next: 'the-tilt',
        },
        {
          label: 'What happens to the coastlines?',
          description: 'Smaller tides squeeze the strip between high and low water. Follow the shore.',
          next: 'the-coasts',
        },
      ],
    },

    'the-tilt': {
      id: 'the-tilt',
      label: 'The tilt',
      title: 'Earth’s seasons might lose their steady rhythm.',
      hook: 'Seasons exist because Earth is tilted. How stable that tilt stays is partly the Moon’s doing.',
      status: 'hypothetical',
      explanation: [
        'Earth’s axis is tilted about 23.4°, and over a cycle of roughly 41,000 years it swings only between about 22.1° and 24.5°. That small range keeps the seasons broadly the same for millions of years.',
        'The Moon’s pull makes Earth’s axis wobble quickly, and that keeps it out of step with slower tugs from the other planets. Without the Moon, those tugs could resonate with the axis and push the tilt around far more.',
        'How far is still debated. An early study found the tilt of a moonless Earth could wander chaotically between 0° and about 85°. Later work suggests the swings would be smaller and slower. Mars, with no large moon, shows how big they can get.',
      ],
      highlight: {
        value: '22.1°–24.5°',
        label: 'The narrow range Earth’s tilt swings through over each ~41,000-year cycle',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Earth’s tilt causes the seasons. More tilt means hotter summers and colder winters.',
        },
        {
          status: 'inferred',
          text: 'Mars’s tilt is thought to have varied between roughly 15° and 45° over the last 10 million years, driving major climate swings.',
        },
        {
          status: 'hypothetical',
          text: 'How much a moonless Earth’s tilt would vary — and how fast — depends on details of the early Solar System and is still debated.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Compare the swings',
        scrubLabel: 'Reveal the possible tilt range without the Moon',
        duration: 7,
        disclaimer: 'Visualization · ranges of axial tilt in degrees · model results are uncertain',
        description:
          'A chart of axial tilt ranges in degrees. Earth today swings between 22.1° and 24.5°. Mars has varied between roughly 15° and 45° over the last 10 million years. One early model of a moonless Earth allowed anything from 0° to about 85°; later studies suggest smaller swings.',
        captions: [
          { at: 0, text: 'Earth’s tilt today: a narrow band.' },
          { at: 0.3, text: 'Mars, without a large moon, swings much more.' },
          { at: 0.9, text: 'A moonless Earth, in one early model: almost anything.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'axial tilt, degrees',
          scale: 'linear',
          items: [
            { label: 'Earth today', min: 22.1, value: 24.5, display: '22.1°–24.5°', status: 'established' },
            { label: 'Mars, last 10 million years', min: 15, value: 45, display: '≈ 15°–45°', status: 'inferred', changed: true },
            { label: 'Moonless Earth (early model)', min: 0, value: 85, display: '0°–85°', status: 'hypothetical', changed: true },
          ],
        },
      },
      choices: [
        {
          label: 'What happens to the length of a day?',
          description: 'The Moon has been slowing Earth’s spin for billions of years. Follow the brake.',
          next: 'day-length',
        },
        {
          label: 'What happens to the night?',
          description: 'No moonlight, no eclipses, no monthly rhythm. Follow the dark.',
          next: 'darker-nights',
        },
      ],
    },
    'the-coasts': {
      id: 'the-coasts',
      label: 'The coasts',
      title: 'The strip between high and low tide would shrink.',
      hook: 'Twice a day, coastlines are flooded and drained. Entire ecosystems live in that gap.',
      status: 'inferred',
      explanation: [
        'The intertidal zone — the band of shore covered at high tide and exposed at low tide — is home to barnacles, mussels, sea stars, crabs and seaweeds adapted to being alternately underwater and in air.',
        'With only the Sun’s tide, that band would narrow to roughly a third of its biggest current width on a typical coast. Some species would lose habitat; the zone itself would not vanish.',
        'Real tidal ranges depend strongly on the shape of coasts and bays, which can amplify tides through resonance. So the simple one-third ratio is only a rough guide.',
      ],
      highlight: {
        value: '16 m',
        label: 'Tidal range in the Bay of Fundy, Canada — the largest on Earth, amplified by the bay’s shape',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Tides stir coastal waters and estuaries, mixing nutrients and oxygen that coastal life depends on.',
        },
        {
          status: 'inferred',
          text: 'Weaker tides would mean less mixing in estuaries and shallow seas, changing where nutrients end up.',
        },
        {
          status: 'hypothetical',
          text: 'Some scientists have proposed that tidal pools helped early life move from sea to land. Whether a moonless Earth would have slowed that is unknown.',
        },
      ],
      choices: [
        {
          label: 'What happens to the length of a day?',
          description: 'Tides don’t just move water. They also slow the planet down.',
          next: 'day-length',
        },
        {
          label: 'What happens to the night?',
          description: 'Many coastal creatures time their lives to the Moon. Follow the dark.',
          next: 'darker-nights',
        },
      ],
    },
    'day-length': {
      id: 'day-length',
      label: 'Day length',
      title: 'Without the Moon’s brake, days would be shorter.',
      hook: 'Every tide drags slightly on Earth’s spin. Over billions of years, that adds up.',
      status: 'inferred',
      explanation: [
        'Tidal bulges are slightly dragged ahead of the Moon by Earth’s rotation, and the Moon pulls back on them. The result is a very slow brake: Earth’s day gets about 1.8 milliseconds longer every century, while the Moon drifts outward.',
        'The record is written in rock. Fossil corals about 400 million years old show daily growth bands suggesting around 400 days in a year — so each day lasted only about 22 hours.',
        'Without the Moon, only the Sun’s weaker tides would brake Earth. Today’s day would likely be considerably shorter than 24 hours, though how much shorter depends on how fast the young Earth spun — which is uncertain.',
      ],
      highlight: {
        value: '≈ 400',
        label: 'Days per year recorded in the growth bands of fossil corals about 400 million years old',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Ancient eclipse records show Earth’s day lengthening by roughly 1.8 milliseconds per century.',
        },
        {
          status: 'established',
          text: 'Laser reflectors left on the Moon by Apollo show it moving away by about 3.8 cm a year.',
        },
        {
          status: 'hypothetical',
          text: 'Estimates of a moonless Earth’s day length today vary widely, because the young Earth’s spin rate is not well known.',
        },
      ],
      conclusion: {
        title: 'The Moon is quietly shaping time on Earth.',
        summary: [
          'Removing the Moon shrinks the tides first. But tides are also a brake on Earth’s spin and, through the Moon’s gravity, part of what keeps the axis steady.',
          'A moonless Earth would likely spin faster and might tilt more erratically over millions of years. The seasons and the day we take for granted are partly lunar inventions.',
        ],
        numbers: [
          { value: '46%', label: 'The Sun’s tide compared with the Moon’s', status: 'established', calculated: true },
          { value: '≈ 1.8 ms', label: 'Added to the day each century by tidal braking', status: 'established' },
          { value: '≈ 400', label: 'Days per year, 400 million years ago', status: 'established' },
        ],
        takeaway: 'The length of your day is set partly by a rock 384,000 km away.',
      },
    },
    'darker-nights': {
      id: 'darker-nights',
      label: 'Darker nights',
      title: 'Nights would be darker, and nature would lose a calendar.',
      hook: 'The Moon is the brightest thing in the night sky — and many animals keep time by it.',
      status: 'inferred',
      explanation: [
        'A full Moon lights the ground hundreds of times more brightly than starlight alone. Without it, every night would be as dark as a new-Moon night is today.',
        'Many species time their lives to the lunar cycle. On the Great Barrier Reef, corals release their eggs and sperm en masse a few nights after a full Moon in spring. Some animals hunt or hide according to how bright the night is.',
        'There would also be no eclipses — neither solar nor lunar. The Sun would only ever be blocked by the occasional planet crossing its face.',
      ],
      highlight: {
        value: '≈ 0.25 lux',
        label: 'Brightness of a full Moon on the ground — hundreds of times brighter than a moonless, starlit night',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Mass coral spawning on the Great Barrier Reef is timed by moonlight and water temperature.',
        },
        {
          status: 'established',
          text: 'Many predators and prey change their behaviour with moonlight — some rodents forage less on bright nights.',
        },
        {
          status: 'hypothetical',
          text: 'Life on a moonless Earth would have evolved without these cues, so different rhythms would likely have taken their place.',
        },
      ],
      conclusion: {
        title: 'The Moon sets rhythms far beyond the tides.',
        summary: [
          'Take away the Moon and the ocean’s twice-daily pulse weakens to about a third. The night loses its light, and life loses a monthly clock that animals from corals to rodents use.',
          'Further out in time, the Moon also steadies Earth’s tilt and slows its spin. Our nights, seasons and days are all quietly shaped by it.',
        ],
        numbers: [
          { value: '≈ 31%', label: 'Biggest tides compared with today', status: 'established', calculated: true },
          { value: '≈ 0.25 lux', label: 'Full-Moon brightness on the ground', status: 'established' },
          { value: '0', label: 'Eclipses, ever', status: 'established' },
        ],
        takeaway: 'Without the Moon, Earth would keep time differently — every night, every month and every age.',
      },
    },
  },
};

export default content;
