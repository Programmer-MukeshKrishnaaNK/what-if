import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'shield',
  discoveries: {
    shield: {
      id: 'shield',
      label: 'The shield',
      title: 'The magnetic field is a shield — and auroras are the proof it is working.',
      status: 'established',
      explanation: [
        'The Sun constantly blows out a stream of charged particles called the solar wind. Earth’s magnetic field deflects most of it, carving out a protective bubble called the magnetosphere.',
        'Some particles get funnelled along the field lines toward the poles. When they hit the upper atmosphere, the air glows: that is an aurora.',
        "Remove the field and the solar wind would strike the upper atmosphere directly. Nothing dramatic would happen at ground level on day one — the atmosphere itself still blocks most of it. The real risk is slow.",
      ],
      highlight: {
        value: '≈ 64,000 km',
        label: "How far upstream Earth's magnetic shield usually meets the solar wind — about 10 Earth radii",
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: "Earth's field has reversed many times. During a reversal it weakens for centuries or longer — and life on Earth came through every one.",
        },
        {
          status: 'inferred',
          text: 'Without a field, the solar wind could strip gas from the upper atmosphere over very long timescales. Mars likely lost much of its air this way.',
        },
        {
          status: 'established',
          text: 'Venus has almost no magnetic field of its own but still keeps a crushingly thick atmosphere. The field is important, but it is not the only factor.',
        },
        {
          status: 'inferred',
          text: 'Satellites, power grids and radio systems would face harsher space weather, and astronauts would lose part of their protection.',
        },
      ],
      visualization: {
        type: 'magnetic-shield',
        triggerLabel: 'Switch off the field',
        scrubLabel: "Weakening of Earth's magnetic field",
        duration: 12,
        disclaimer: 'Visualization · not to scale · boundary distance is calculated',
        description:
          "Earth on the right with looping magnetic field lines, and solar wind particles streaming in from the Sun on the left. While the field is strong, particles flow around a curved boundary far from Earth and a few are funnelled to the poles, where they make auroras. As the field weakens, the boundary moves closer to the planet. With no field left, particles strike the upper atmosphere directly across the whole day side.",
        captions: [
          { at: 0, text: 'The solar wind flows around Earth’s magnetic bubble.' },
          { at: 0.02, text: 'The field is weakening. The shield shrinks inward.' },
          { at: 0.5, text: 'Auroras spread toward lower latitudes.' },
          { at: 0.92, text: 'No field: the solar wind meets the upper atmosphere head-on.' },
        ],
      },
      choices: [
        {
          label: 'Does Earth lose its air?',
          description: 'The solar wind now touches the top of the atmosphere. Follow the slow leak.',
          next: 'the-air',
        },
        {
          label: 'What happens to technology?',
          description: 'Satellites, power grids and navigation all live inside the shield. Follow the machines.',
          next: 'technology',
        },
      ],
    },

    'the-air': {
      id: 'the-air',
      label: 'The air',
      title: 'Earth would leak air — on a geological timescale.',
      hook: 'Losing an atmosphere sounds sudden. The numbers say otherwise.',
      status: 'inferred',
      explanation: [
        'Earth already loses gas to space, field or no field: roughly 90 tonnes a day, mostly hydrogen and helium. That sounds like a lot until you compare it with the roughly 5 million billion tonnes of air above us.',
        'Without a magnetic field, the solar wind would strip ions from the upper atmosphere more directly. Mars likely lost much of its air this way — but over hundreds of millions to billions of years.',
        'Researchers still debate how much a magnetic field actually protects an atmosphere. Some studies suggest magnetised planets lose gas at comparable rates through other routes.',
      ],
      highlight: {
        value: '≈ 160 billion years',
        label: 'How long Earth would take to lose its atmosphere at today’s escape rate — more than 10 times the age of the universe',
        status: 'inferred',
        basis: '5.15 × 10¹⁵ tonnes of atmosphere ÷ 90 tonnes per day ÷ 365 days. Real loss without a field would be faster, but even 100× faster gives about 1.6 billion years.',
      },
      facts: [
        {
          status: 'established',
          text: 'NASA’s MAVEN spacecraft measured Mars losing gas to the solar wind, and the rate rises during solar storms.',
        },
        {
          status: 'established',
          text: 'Venus has no global magnetic field yet keeps an atmosphere with about 90 times Earth’s surface pressure.',
        },
        {
          status: 'hypothetical',
          text: 'Exactly how fast an unshielded Earth would lose its air is uncertain; estimates depend on solar activity and upper-atmosphere chemistry.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Compare the timescales',
        scrubLabel: 'Reveal how long the atmosphere would last',
        duration: 7,
        disclaimer: 'Visualization · log scale · years · loss rates are rough',
        description:
          'A bar chart of timescales in years on a logarithmic scale. Recorded human history is about 5,000 years; Earth is about 4.5 billion years old; the universe is about 13.8 billion years old. Then: losing the whole atmosphere at today’s rate would take about 160 billion years, and even at 100 times today’s rate about 1.6 billion years.',
        captions: [
          { at: 0, text: 'Human history, Earth’s age and the universe’s age, for scale.' },
          { at: 0.5, text: 'At 100 times today’s loss rate…' },
          { at: 0.9, text: '…and at today’s rate. The air outlasts almost everything.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'years',
          scale: 'log',
          items: [
            { label: 'Recorded human history', value: 5000, display: '≈ 5,000 yr', status: 'established' },
            { label: 'Age of Earth', value: 4.5e9, display: '4.5 billion yr', status: 'established' },
            { label: 'Age of the universe', value: 1.38e10, display: '13.8 billion yr', status: 'established' },
            { label: 'Lose all air at 100× today’s rate', value: 1.6e9, display: '≈ 1.6 billion yr', status: 'hypothetical', changed: true, calculated: true },
            { label: 'Lose all air at today’s rate', value: 1.6e11, display: '≈ 160 billion yr', status: 'inferred', changed: true, calculated: true },
          ],
        },
      },
      choices: [
        {
          label: 'What reaches the ground?',
          description: 'The air stays. Does the radiation get through it?',
          next: 'the-ground',
        },
        {
          label: 'What happens to animals that navigate by it?',
          description: 'Turtles, birds and salmon read the field like a map. Follow them.',
          next: 'navigators',
        },
      ],
    },
    'technology': {
      id: 'technology',
      label: 'Technology',
      title: 'Space weather would reach much deeper into our machines.',
      hook: 'Most of our satellites orbit inside the magnetic bubble. Remove the bubble and they are outside.',
      status: 'inferred',
      explanation: [
        'The International Space Station orbits about 400 km up; GPS satellites about 20,200 km up. Both sit well inside today’s magnetic shield, which extends about 64,000 km toward the Sun.',
        'Without it, more energetic particles would reach satellite electronics and astronauts. Satellites would need heavier shielding or shorter lives, and radio communication through a more disturbed upper atmosphere would be less reliable.',
        'Some things would simply stop working. Every magnetic compass would lose its north.',
      ],
      highlight: {
        value: '1859',
        label: 'The Carrington Event — the strongest geomagnetic storm on record — sparked and disrupted telegraph systems worldwide',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'In March 1989 a geomagnetic storm caused a nine-hour blackout across the Canadian province of Quebec.',
        },
        {
          status: 'established',
          text: 'In 2022, a moderate geomagnetic storm caused about 40 newly launched Starlink satellites to fall back to Earth.',
        },
        {
          status: 'hypothetical',
          text: 'The overall cost to modern technology without any field is hard to estimate; it would depend on how engineering adapted.',
        },
      ],
      choices: [
        {
          label: 'What reaches the ground?',
          description: 'Satellites get hit harder. What about people standing on the surface?',
          next: 'the-ground',
        },
        {
          label: 'What happens to animals that navigate by it?',
          description: 'Compasses fail. So does the sense some animals use instead of one.',
          next: 'navigators',
        },
      ],
    },
    'the-ground': {
      id: 'the-ground',
      label: 'The ground',
      title: 'At ground level, the atmosphere would still be the main shield.',
      hook: 'Above every square metre of ground sits about 10 tonnes of air. That is a lot of shielding.',
      status: 'inferred',
      explanation: [
        'Most charged particles from space never reach the surface, field or no field. The atmosphere absorbs them high up, with a shielding effect comparable to standing under about 10 metres of water.',
        'Without the magnetic field, more cosmic rays would enter the atmosphere, especially at low latitudes, so radiation at the surface would rise. Most estimates suggest a modest increase, not a deadly one.',
        'There is a natural experiment. About 41,000 years ago, during the Laschamp excursion, the field dropped to a small fraction of its current strength for several centuries. Life carried on, though some researchers link the period to environmental changes.',
      ],
      highlight: {
        value: '≈ 10 tonnes',
        label: 'Of air above each square metre of ground — roughly the shielding of 10 m of water',
        status: 'established',
        basis: 'Sea-level pressure (101,325 Pa) ÷ gravity (9.81 m/s²) ≈ 10,300 kg per m².',
      },
      facts: [
        {
          status: 'established',
          text: 'During the Laschamp excursion, production of radioactive beryllium-10 by cosmic rays roughly doubled — a record of the field’s weakness preserved in ice cores.',
        },
        {
          status: 'established',
          text: 'Cosmic rays contribute only a fraction of the natural radiation dose most people receive at sea level.',
        },
        {
          status: 'hypothetical',
          text: 'Precise dose increases for a field-free Earth vary between models and with solar activity.',
        },
      ],
      conclusion: {
        title: 'The magnetic field is a shield for our machines more than for our bodies.',
        summary: [
          'Losing the field would not strip the air away in a lifetime, or even in millions of lifetimes. The atmosphere itself would still absorb most of the radiation before it reached us.',
          'What would change quickly is the space around Earth: satellites, astronauts and radio would all face a harsher environment, and the planet would lose the auroras’ neat polar ovals.',
        ],
        numbers: [
          { value: '≈ 10 t/m²', label: 'Air above every square metre of ground', status: 'established', calculated: true },
          { value: '≈ 160 bn yr', label: 'To lose the air at today’s escape rate', status: 'inferred', calculated: true },
          { value: '≈ 41,000 yr', label: 'Since the field last nearly vanished', status: 'established' },
        ],
        takeaway: 'Our air protects us; our magnetic field mostly protects the space we have learned to use.',
      },
    },
    'navigators': {
      id: 'navigators',
      label: 'Navigators',
      title: 'Animals that read the field would lose a sense.',
      hook: 'Some animals carry a compass — and possibly a map — inside their bodies.',
      status: 'inferred',
      explanation: [
        'Sea turtles, salmon, many migratory birds and even some insects use Earth’s magnetic field to orient themselves. Young loggerhead turtles respond to the field’s strength and angle as if reading positions on a map.',
        'Without a field, that information would vanish. These animals also use the Sun, the stars, smells and landmarks, so they would not be completely lost — but long migrations would become harder and less precise.',
        'Exactly how animals sense the field is still being worked out, which makes predicting their response uncertain.',
      ],
      highlight: {
        value: 'In the eye?',
        label: 'For birds, the leading hypothesis places the magnetic sensor in light-sensitive proteins (cryptochromes) in the retina',
        status: 'hypothetical',
      },
      facts: [
        {
          status: 'established',
          text: 'Salmon returning from years at sea appear to use the magnetic signature of their home coastline to find their river.',
        },
        {
          status: 'established',
          text: 'Migratory birds placed in artificial magnetic fields change the direction they try to fly.',
        },
        {
          status: 'inferred',
          text: 'The field has weakened and reversed many times; migratory species evidently survived those periods, possibly by leaning on other cues.',
        },
      ],
      conclusion: {
        title: 'The field is invisible to us — but not to everything alive.',
        summary: [
          'For humans, losing the magnetic field is mostly a technology problem: satellites, grids and compasses. The atmosphere still shields our bodies.',
          'For animals that navigate by the field, it is the loss of a sense. They have other cues, and past field collapses show life copes — but migrations that depend on precision would get harder.',
        ],
        numbers: [
          { value: '≈ 64,000 km', label: 'How far the shield reaches toward the Sun', status: 'established' },
          { value: '1859', label: 'The largest geomagnetic storm on record', status: 'established' },
          { value: '≈ 41,000 yr', label: 'Since the last near-collapse of the field', status: 'established' },
        ],
        takeaway: 'An invisible field turns out to be part of how life finds its way.',
      },
    },
  },
};

export default content;
