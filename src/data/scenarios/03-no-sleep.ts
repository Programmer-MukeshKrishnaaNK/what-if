import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'sleep-does-work',
  discoveries: {
    'sleep-does-work': {
      id: 'sleep-does-work',
      label: 'Sleep does work',
      title: "Sleep isn't the brain switching off. It's the brain doing different work.",
      status: 'established',
      explanation: [
        "During sleep the brain replays and strengthens memories from the day. Some kinds of learning measurably improve after a night's sleep — without any extra practice.",
        "Sleep also seems to be when the brain's waste-clearing system works hardest, flushing out by-products that build up while we're awake.",
        "So a world without sleep isn't just a world with more hours. Something would have to take over the jobs sleep does — or humans would need very different brains.",
      ],
      highlight: {
        value: '≈ 26 years',
        label: 'Extra waking time over an 80-year life',
        status: 'established',
        basis: '8 hours of sleep a night is one third of each day; one third of 80 years ≈ 26.7 years.',
      },
      facts: [
        {
          status: 'established',
          text: 'After 17–19 hours awake, performance on some reaction tests is comparable to having a blood alcohol level of 0.05%.',
        },
        {
          status: 'established',
          text: 'Nearly every animal studied shows some form of sleep or sleep-like rest — even jellyfish, which have no brain at all.',
        },
        {
          status: 'inferred',
          text: "Studies in mice show the brain clears waste much faster during sleep. Evidence in humans points the same way but is still being researched.",
        },
        {
          status: 'hypothetical',
          text: 'Work, school and entertainment are all built around a day with eight hours already taken. A sleepless society would need entirely new rhythms.',
        },
      ],
      visualization: {
        type: 'sleepless-day',
        triggerLabel: 'Remove sleep',
        scrubLabel: 'How much of the night sleep still occupies',
        duration: 9,
        disclaimer: 'Visualization · counts are calculated from an 8-hour night',
        description:
          'A 24-hour clock face with the night from 11 pm to 7 am shaded as sleep, and inside it three jobs sleep does: memory consolidation, waste clearance and hormone release. Beside it, a bar shows an 80-year life with a third shaded as sleep. When sleep is removed, the night shrinks to nothing, the lifetime bar fills with waking time, and the three jobs are left without a time slot.',
        captions: [
          { at: 0, text: 'A typical day: 16 hours awake, 8 hours asleep.' },
          { at: 0.05, text: 'The night is shrinking…' },
          { at: 0.55, text: "Sleep's jobs are being squeezed out." },
          { at: 0.98, text: '24 waking hours. Memory, cleanup and repair now have no time slot.' },
        ],
      },
      choices: [
        {
          label: 'What would the brain need instead?',
          description: 'Memory, cleanup and repair would need a new time slot — or new biology. Follow the brain.',
          next: 'the-brain',
        },
        {
          label: 'What would society do with the time?',
          description: 'Twenty-six extra years each. Follow work, cities and energy through a 24-hour day.',
          next: 'society',
        },
      ],
    },

    'the-brain': {
      id: 'the-brain',
      label: 'The brain',
      title: 'A sleepless brain would have to do its maintenance while awake.',
      hook: 'Some animals already never fully switch off. They sleep one half of the brain at a time.',
      status: 'inferred',
      explanation: [
        'Dolphins and many birds have unihemispheric sleep: one half of the brain shows deep-sleep activity while the other half stays awake, keeping them swimming, breathing or watching for predators.',
        'That suggests one biological route to “never sleeping”: never sleeping all at once. Maintenance would happen in rotating shifts rather than in a nightly shutdown.',
        'Humans don’t work this way. A brain that never slept would need entirely new machinery to consolidate memories and clear waste while still running — which is why this is hypothetical biology, not a lifestyle choice.',
      ],
      highlight: {
        value: '≈ 42 min',
        label: 'Daily sleep measured in great frigatebirds during flights lasting days — mostly one brain hemisphere at a time',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Bottlenose dolphins can stay continuously alert for days by resting one brain hemisphere at a time.',
        },
        {
          status: 'inferred',
          text: 'A leading hypothesis says sleep “turns down” synapses strengthened during the day, making room for new learning. Not all researchers agree.',
        },
        {
          status: 'hypothetical',
          text: 'Whether a large human-like brain could do all of sleep’s jobs while awake is unknown.',
        },
      ],
      choices: [
        {
          label: 'How would learning change?',
          description: 'Sleep helps lock in what we learn. Follow what replaces it.',
          next: 'learning',
        },
        {
          label: 'What happens to the night?',
          description: 'If nobody sleeps, nothing has to be dark or quiet. Follow the night itself.',
          next: 'the-night',
        },
      ],
    },
    'society': {
      id: 'society',
      label: 'Society',
      title: 'Cities would never switch off.',
      hook: 'Today, the world runs on a schedule that assumes a third of everyone is unconscious.',
      status: 'hypothetical',
      explanation: [
        'Each person would gain eight waking hours a day: half as much waking time again. Over a year that is nearly 3,000 hours — more than a full-time working year in most countries.',
        'Night as we know it is shaped by sleep. Electricity demand dips, roads empty, shops close. Without sleep, demand would spread across all 24 hours, and the idea of a “night shift” would mean very little.',
        'Whether people would spend the time on more work, more leisure or more learning is a choice societies would make — not something physics or biology can predict.',
      ],
      highlight: {
        value: '+50%',
        label: 'Extra waking time each day: from 16 hours to 24',
        status: 'established',
        basis: '(24 − 16) ÷ 16 = 0.5.',
      },
      facts: [
        {
          status: 'established',
          text: 'Electricity grids today see demand fall overnight and rise through the day; they are planned around that rhythm.',
        },
        {
          status: 'established',
          text: 'Full-time workers in OECD countries average roughly 1,500–2,000 working hours a year.',
        },
        {
          status: 'hypothetical',
          text: 'Whether extra hours would raise productivity or simply stretch the working day is a social question, not a scientific one.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Add the hours',
        scrubLabel: 'Reveal waking hours without sleep',
        duration: 6,
        disclaimer: 'Visualization · hours per year · calculated from 8 hours of sleep a night',
        description:
          'A bar chart of hours per year. A typical full-time working year is about 1,800 hours. Waking hours today, with 8 hours of sleep a night, are about 5,840. Without sleep they grow to 8,766 — every hour of the year.',
        captions: [
          { at: 0, text: 'A working year, and a waking year, as they are today.' },
          { at: 0.5, text: 'Remove sleep…' },
          { at: 0.9, text: 'Every hour of the year, awake.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'hours per year',
          scale: 'linear',
          items: [
            { label: 'Typical full-time working year', value: 1800, display: '≈ 1,800 h', status: 'established' },
            { label: 'Waking hours today', value: 5844, display: '≈ 5,840 h', status: 'established', calculated: true },
            { label: 'Waking hours without sleep', value: 8766, display: '8,766 h', status: 'established', changed: true, calculated: true },
          ],
        },
      },
      choices: [
        {
          label: 'How would learning change?',
          description: 'More hours to study — but the brain’s overnight filing system is gone.',
          next: 'learning',
        },
        {
          label: 'What happens to the night?',
          description: 'A 24-hour society lights the dark. Follow what lives in it.',
          next: 'the-night',
        },
      ],
    },
    'learning': {
      id: 'learning',
      label: 'Learning',
      title: 'Learning would need a new way to lock memories in.',
      hook: 'You don’t just learn while studying. Part of it happens afterwards, while you sleep.',
      status: 'inferred',
      explanation: [
        'In many experiments, people who sleep after learning remember more than people who stay awake for the same length of time. During sleep the brain replays the day’s patterns and strengthens some of them.',
        'Quiet, wakeful rest helps too. Even a few minutes of doing nothing after learning can improve later recall compared with jumping straight into another task.',
        'So a sleepless species might evolve — or design — regular periods of offline rest: not sleep, but not fully “on” either. More waking hours would not automatically mean more learning.',
      ],
      highlight: {
        value: '≈ 10 min',
        label: 'Of quiet, wakeful rest after learning has been shown to measurably improve later recall',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Sleep after learning improves memory for facts and skills compared with an equal period awake.',
        },
        {
          status: 'established',
          text: 'Recordings in rats show “replay” of the day’s brain activity patterns during sleep.',
        },
        {
          status: 'hypothetical',
          text: 'How a sleepless brain would balance taking in new information against stabilising what it already learned is unknown.',
        },
      ],
      conclusion: {
        title: 'Removing sleep doesn’t just add hours — it removes a job the brain depends on.',
        summary: [
          'A sleepless human gains a third of a lifetime. But sleep is when the brain files memories and clears waste, so that work would need a new home: half-brain rest like dolphins, or offline periods while awake.',
          'The extra hours are real and calculable. What a mind does with them depends on biology we don’t have.',
        ],
        numbers: [
          { value: '≈ 26 years', label: 'Extra waking time over an 80-year life', status: 'established', calculated: true },
          { value: '≈ 42 min', label: 'Daily sleep of frigatebirds in flight', status: 'established' },
          { value: '≈ 10 min', label: 'Of wakeful rest that improves recall', status: 'established' },
        ],
        takeaway: 'More time awake is only an advantage if the brain can do sleep’s work some other way.',
      },
    },
    'the-night': {
      id: 'the-night',
      label: 'The night',
      title: 'The night would stop being dark and quiet.',
      hook: 'Humans already light the night. A species that never sleeps would light all of it.',
      status: 'inferred',
      explanation: [
        'Artificial light at night already affects wildlife: it disorients migrating birds, draws insects away from their normal lives and disrupts sea turtle hatchlings heading for the sea.',
        'A society active around the clock would have every reason to keep streets, buildings and transport lit through the night.',
        'Many animals depend on darkness to hunt, hide or navigate. For them, a sleepless humanity would mean a planet with far less night left in it.',
      ],
      highlight: {
        value: '≈ 83%',
        label: 'Share of the world’s population already living under light-polluted night skies',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Around 30% of vertebrate species and more than 60% of invertebrate species are active mainly at night.',
        },
        {
          status: 'established',
          text: 'Artificial light at night is a documented threat to insect populations and to the birds that migrate through cities.',
        },
        {
          status: 'hypothetical',
          text: 'How far a sleepless society would push lighting — or choose to protect darkness — is a choice, not a prediction.',
        },
      ],
      conclusion: {
        title: 'A world without sleep would also be a world without much night.',
        summary: [
          'Sleep shapes more than the brain. It shapes when cities rest, when energy demand falls and when the dark is left to the animals that need it.',
          'Remove sleep and the brain needs a new way to do its maintenance — and the planet loses its quiet hours.',
        ],
        numbers: [
          { value: '+50%', label: 'More waking time per day', status: 'established', calculated: true },
          { value: '≈ 83%', label: 'Of people under light-polluted skies today', status: 'established' },
          { value: '8,766 h', label: 'Waking hours in a sleepless year', status: 'established', calculated: true },
        ],
        takeaway: 'Night exists for us because we sleep through it.',
      },
    },
  },
};

export default content;
