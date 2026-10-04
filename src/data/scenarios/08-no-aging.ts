import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'generations-stack',
  discoveries: {
    'generations-stack': {
      id: 'generations-stack',
      label: 'Generations stack',
      title: 'Stop aging, and generations stop making way for each other.',
      status: 'hypothetical',
      explanation: [
        'Today a human life follows a familiar arc: children grow up, adults age, and eventually each generation passes on. Roughly every 25 years another generation arrives.',
        'If aging stopped, people would still die — from accidents, disease and violence — but far less often. Each new generation would join the ones before it instead of replacing them.',
        "That single change ripples through everything: how many people the planet holds, who gets the jobs, who holds power, and what 'retirement' even means.",
      ],
      highlight: {
        value: '≈ 1,000 years',
        label: 'Average lifespan if everyone kept the yearly death risk of a healthy young adult',
        status: 'inferred',
        basis: 'Assumes a constant 0.1% chance of dying each year. Average lifespan = 1 ÷ 0.001 = 1,000 years. A rough calculation, not a forecast.',
      },
      facts: [
        {
          status: 'established',
          text: "Some animals barely seem to age. Naked mole-rats and some tortoises show little rise in their risk of death as they get older.",
        },
        {
          status: 'inferred',
          text: 'If births continued at today’s pace, the population would keep climbing for centuries instead of levelling off.',
        },
        {
          status: 'hypothetical',
          text: 'Careers, inheritance, elections and schooling all assume people move through life stages. Every one of them would need rethinking.',
        },
      ],
      visualization: {
        type: 'generations',
        triggerLabel: 'Stop aging',
        scrubLabel: 'Years since aging stopped',
        duration: 14,
        disclaimer: 'Visualization · population is a simple calculated model, not a forecast',
        description:
          'A timeline with one bar per generation, a new generation arriving every 25 years. Before aging stops, each bar ends after about 80 years, so only three or four overlap at any moment. After aging stops, bars no longer end; a dashed outline marks where each life would normally have finished. A cursor sweeps 300 years forward while counters show how many generations are alive at once and how the population compares with today.',
        captions: [
          { at: 0, text: 'Today: each generation lives about 80 years. Three or four overlap.' },
          { at: 0.03, text: 'Aging stops. Lives keep going past the dashed line.' },
          { at: 0.35, text: 'New generations arrive. Nobody makes room.' },
          { at: 0.8, text: 'A dozen generations, side by side.' },
        ],
      },
      choices: [
        {
          label: 'What happens to population?',
          description: 'Follow the numbers as births continue and deaths become rare.',
          next: 'population',
        },
        {
          label: 'What happens to careers and power?',
          description: 'Follow the jobs, the inheritances and the people in charge.',
          next: 'work-and-power',
        },
      ],
    },

    'population': {
      id: 'population',
      label: 'Population',
      title: 'Population would climb until births or deaths changed.',
      hook: 'Today, roughly two people are born for every one who dies. Stop aging, and that ratio explodes.',
      status: 'inferred',
      explanation: [
        'Around 130 million babies are born each year and around 60 million people die, most of them from age-related causes. The difference is why the world’s population still grows.',
        'If aging stopped and everyone kept the death risk of a healthy young adult — roughly 0.1% a year — deaths would fall to around 8 million a year. With births unchanged, the population would grow by well over 100 million people every year.',
        'In practice, societies would almost certainly respond, most likely by having fewer children. How quickly and how fairly that would happen is a social question, not a calculation.',
      ],
      highlight: {
        value: '≈ 8 million',
        label: 'Deaths per year if no one aged — compared with about 60 million today',
        status: 'inferred',
        basis: '0.1% yearly death risk × 8.1 billion people ≈ 8.1 million deaths per year.',
      },
      facts: [
        {
          status: 'established',
          text: 'Global life expectancy rose from about 32 years in 1900 to over 70 today, mostly through fewer early deaths.',
        },
        {
          status: 'established',
          text: 'Many countries already have fertility rates below the 2.1 children per woman needed to replace the population.',
        },
        {
          status: 'hypothetical',
          text: 'How birth rates would respond to a world without aging is unpredictable.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Stop aging',
        scrubLabel: 'Reveal deaths per year without aging',
        duration: 6,
        disclaimer: 'Visualization · millions of people per year · approximate',
        description:
          'A bar chart in millions of people per year. Today there are about 132 million births and about 62 million deaths a year. Without aging, deaths would fall to roughly 8 million a year, so the gap between births and deaths would widen to about 124 million a year.',
        captions: [
          { at: 0, text: 'Births and deaths today.' },
          { at: 0.5, text: 'Stop aging, and deaths collapse…' },
          { at: 0.9, text: '…while births carry on.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'millions per year',
          scale: 'linear',
          items: [
            { label: 'Births per year', value: 132, display: '≈ 132 M', status: 'established' },
            { label: 'Deaths per year, today', value: 62, display: '≈ 62 M', status: 'established' },
            { label: 'Deaths per year, no aging', value: 8, display: '≈ 8 M', status: 'inferred', changed: true, calculated: true },
            { label: 'Yearly growth, no aging', value: 124, display: '≈ +124 M', status: 'inferred', changed: true, calculated: true },
          ],
        },
      },
      choices: [
        {
          label: 'Can the planet support it?',
          description: 'Food, water and energy for a population that keeps growing.',
          next: 'the-planet',
        },
        {
          label: 'What happens to people who live for centuries?',
          description: 'Bodies stay young. Follow what happens to minds and relationships.',
          next: 'long-lives',
        },
      ],
    },
    'work-and-power': {
      id: 'work-and-power',
      label: 'Work and power',
      title: 'Nobody would retire — so nobody would move up.',
      hook: 'Careers, inheritance and politics all quietly assume that people get old and step aside.',
      status: 'hypothetical',
      explanation: [
        'Today, people retire and their jobs open up for the next generation. Without aging, there would be no physical reason to stop working at 65 — or at 165.',
        'Wealth and property would pass down far more slowly. Inheritance, which today moves assets between generations every few decades, might happen once in centuries.',
        'Positions of power would raise the same question. Without term limits, a leader, judge or company founder could hold on for a very long time.',
      ],
      highlight: {
        value: '≈ 30',
        label: 'Median age of the world’s population today — half are younger, half older',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Pension systems are designed around people working for a few decades and then living a limited number of years after retiring.',
        },
        {
          status: 'inferred',
          text: 'Without turnover, opportunities for younger generations would depend on growth, new institutions or rules that force rotation.',
        },
        {
          status: 'hypothetical',
          text: 'Whether centuries-long careers would bring wisdom, stagnation or both is impossible to predict.',
        },
      ],
      choices: [
        {
          label: 'Can the planet support it?',
          description: 'A society that never steps aside also never shrinks. Follow the resources.',
          next: 'the-planet',
        },
        {
          label: 'What happens to people who live for centuries?',
          description: 'A job for 300 years. Follow what that does to a mind.',
          next: 'long-lives',
        },
      ],
    },
    'the-planet': {
      id: 'the-planet',
      label: 'The planet',
      title: 'The limit would become resources, not lifespans.',
      hook: 'Every extra person needs food, water and energy — for a very long time.',
      status: 'inferred',
      explanation: [
        'Agriculture already uses about half of the world’s habitable land. A population that kept growing would need more food, more water and more energy, or much better ways of producing them.',
        'Technology has repeatedly raised how many people Earth can feed, through better crops and fertilisers. But it has not removed limits on land, fresh water or the climate.',
        'So the deciding factor would shift. Instead of aging setting how long people live, the planet’s resources — and how societies share them — would set how many people can live.',
      ],
      highlight: {
        value: '≈ 50%',
        label: 'Of the world’s habitable land is already used for agriculture',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Agriculture accounts for roughly 70% of the fresh water humans withdraw.',
        },
        {
          status: 'established',
          text: 'Crop yields per hectare have roughly tripled for major cereals since the 1960s.',
        },
        {
          status: 'hypothetical',
          text: 'The maximum population Earth can sustain depends on technology and lifestyle; published estimates vary enormously.',
        },
      ],
      conclusion: {
        title: 'Stopping aging moves the limit from our bodies to our planet.',
        summary: [
          'People would still die, but rarely. With births continuing, population would grow for centuries, and the generations would stack instead of replacing each other.',
          'Food, water and land — already under pressure — would become the real constraint. Ending aging would force decisions that aging currently makes for us.',
        ],
        numbers: [
          { value: '≈ 1,000 yr', label: 'Average lifespan at a young adult’s death risk', status: 'inferred', calculated: true },
          { value: '≈ 8 M', label: 'Deaths per year without aging', status: 'inferred', calculated: true },
          { value: '≈ 50%', label: 'Of habitable land already farmed', status: 'established' },
        ],
        takeaway: 'Aging is cruel, but it is also how the world makes room.',
      },
    },
    'long-lives': {
      id: 'long-lives',
      label: 'Long lives',
      title: 'A body that doesn’t age still carries a mind that keeps changing.',
      hook: 'No human has lived much past 120. Nobody knows what a 500-year-old mind would be like.',
      status: 'hypothetical',
      explanation: [
        'Memory isn’t a fixed-size store that fills up, but it isn’t perfect either. People forget, reinterpret and rebuild their memories all the time. Over centuries, someone’s early life might feel like another person’s.',
        'Relationships would change shape too. A marriage, a friendship or a feud could last hundreds of years — or people might expect to live many separate lives in sequence.',
        'Research on older adults suggests emotional well-being often improves with age as people focus on what matters to them. Whether that would hold over centuries is a complete unknown.',
      ],
      highlight: {
        value: '122 years',
        label: 'The longest verified human lifespan: Jeanne Calment, who died in 1997',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Memories are reconstructed each time they are recalled, and they change in the process.',
        },
        {
          status: 'inferred',
          text: 'Many studies find that older adults report fewer negative emotions than younger adults.',
        },
        {
          status: 'hypothetical',
          text: 'There is no data at all on human minds beyond about 120 years old.',
        },
      ],
      conclusion: {
        title: 'We would solve aging and discover how little we know about long lives.',
        summary: [
          'Stopping aging is a demographic event — generations stacking, deaths becoming rare — and a social one, as careers, inheritance and power stop turning over.',
          'It is also a psychological experiment no one has run. Bodies would stay young; what centuries of memory and relationships do to a person is unknown.',
        ],
        numbers: [
          { value: '122 years', label: 'Longest verified human life', status: 'established' },
          { value: '≈ 1,000 yr', label: 'Average lifespan without aging (rough)', status: 'inferred', calculated: true },
          { value: '≈ 4', label: 'Generations alive at once today', status: 'established' },
        ],
        takeaway: 'Living longer is easy to imagine. Being someone for 500 years is not.',
      },
    },
  },
};

export default content;
