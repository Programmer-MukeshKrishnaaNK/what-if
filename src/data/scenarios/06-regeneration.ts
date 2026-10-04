import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'scar-or-rebuild',
  discoveries: {
    'scar-or-rebuild': {
      id: 'scar-or-rebuild',
      label: 'Scar or rebuild',
      title: 'Your body chooses a fast scar over a slow rebuild.',
      status: 'established',
      explanation: [
        'When you are injured, the priority is to seal the wound quickly and keep infection out. Your body does that with scar tissue — fast and strong, but not the original structure.',
        'Animals like axolotls take a different route. Cells near the wound form a cluster called a blastema, which regrows the missing part in the right shape, with the right tissues in the right places.',
        'Humans are not completely locked out: the liver can regrow lost tissue, and young children can sometimes regrow a fingertip. The hypothetical leap is extending that to whole limbs.',
      ],
      highlight: {
        value: 'up to ~70%',
        label: 'of a healthy human liver can be surgically removed — and the remainder grows back toward its original size within months',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Axolotls can regrow limbs, parts of the spinal cord, heart tissue and even parts of the brain.',
        },
        {
          status: 'established',
          text: 'Young children can sometimes regrow the very tip of a finger if the injury is close to the nail.',
        },
        {
          status: 'hypothetical',
          text: 'Enhanced regeneration would transform medicine and recovery — but tissue that grows quickly also raises questions about cancer risk, which researchers take seriously.',
        },
      ],
      visualization: {
        type: 'regeneration',
        triggerLabel: 'Start healing',
        scrubLabel: 'Time since the injury',
        duration: 12,
        disclaimer: 'Visualization · simplified anatomy · timing is approximate',
        description:
          'Three limbs side by side, each missing its lower part: an axolotl limb, a human arm as it heals today, and a hypothetical human arm with axolotl-like regeneration. Over time the axolotl forms a rounded bud called a blastema that grows into a complete limb with four digits. The human arm today closes over with scar tissue and does not regrow. The hypothetical arm, drawn with a dashed outline to mark it as speculative, regrows like the axolotl.',
        captions: [
          { at: 0, text: 'Three injuries. Same starting point.' },
          { at: 0.06, text: 'All three close the wound with a layer of new skin.' },
          { at: 0.3, text: 'The axolotl builds a blastema. The human builds a scar.' },
          { at: 0.7, text: 'Digits form last — the pattern is rebuilt, not just filled in.' },
          { at: 0.97, text: 'Regrown vs. scarred. The hypothetical human follows the axolotl.' },
        ],
      },
      choices: [
        {
          label: 'What would it take biologically?',
          description: 'Follow the cells: what an axolotl does that we don’t, step by step.',
          next: 'the-biology',
        },
        {
          label: 'What would change in medicine?',
          description: 'Follow the clinic: injuries, transplants and what “recovery” would mean.',
          next: 'medicine',
        },
      ],
    },

    'the-biology': {
      id: 'the-biology',
      label: 'The biology',
      title: 'Regrowing a limb needs cells that remember where they are.',
      hook: 'An axolotl doesn’t just grow tissue. It grows the right tissue, in the right place, in the right order.',
      status: 'established',
      explanation: [
        'After an axolotl loses a limb, cells near the wound partly reverse their specialisation and gather into a blastema. Crucially, they keep a “positional memory”: cells from the upper arm rebuild everything beyond the upper arm, and nothing else.',
        'Regrowth also depends on signals from outside the blastema. Remove the nerves supplying the limb and it won’t regenerate. Remove certain immune cells — macrophages — and the axolotl forms a scar instead.',
        'Human cells have many of the same genes. For humans to regenerate limbs, those programmes would have to be switched on and coordinated in the right sequence — something no one yet knows how to do.',
      ],
      facts: [
        {
          status: 'established',
          text: 'Denervated axolotl limbs fail to regenerate; nerves supply signals the blastema needs to grow.',
        },
        {
          status: 'established',
          text: 'When macrophages are removed from axolotls, wounds scar and limbs do not regrow.',
        },
        {
          status: 'hypothetical',
          text: 'Reactivating a full regeneration programme in adult human tissue is beyond current science.',
        },
      ],
      choices: [
        {
          label: 'What’s the risk?',
          description: 'Fast-growing, rewound cells sound a lot like cancer. Follow the trade-off.',
          next: 'the-risk',
        },
        {
          label: 'Why don’t humans already do this?',
          description: 'If regeneration is so useful, why did mammals lose most of it? Follow evolution.',
          next: 'evolution',
        },
      ],
    },
    'medicine': {
      id: 'medicine',
      label: 'Medicine',
      title: 'Amputations, transplants and scars would mean something new.',
      hook: 'Much of modern medicine is built around the body’s inability to rebuild itself.',
      status: 'hypothetical',
      explanation: [
        'Today, a lost limb is replaced by a prosthesis and a failing organ by a transplant. Regeneration would change both: limbs could regrow, and damaged organs might repair themselves instead of being replaced.',
        'Recovery would become a matter of time and supervision rather than replacement. A regrown arm could take months, and would need guidance to grow back correctly.',
        'Scars would become rarer. That matters beyond appearance: internal scarring after a heart attack is part of why damaged hearts never fully recover.',
      ],
      highlight: {
        value: '> 100,000',
        label: 'People on the US national organ transplant waiting list at any one time',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'After a heart attack, dead heart muscle is replaced by scar tissue that cannot contract.',
        },
        {
          status: 'established',
          text: 'Zebrafish can regrow heart muscle after injury — a major focus of regeneration research.',
        },
        {
          status: 'hypothetical',
          text: 'How long a regrown human limb would take, and how well it would work, cannot be predicted from current knowledge.',
        },
      ],
      choices: [
        {
          label: 'What’s the risk?',
          description: 'Regrowth means rapid cell division. Follow the danger hidden in that.',
          next: 'the-risk',
        },
        {
          label: 'Why don’t humans already do this?',
          description: 'Before rewriting medicine, ask why evolution didn’t give us this already.',
          next: 'evolution',
        },
      ],
    },
    'the-risk': {
      id: 'the-risk',
      label: 'The risk',
      title: 'Regeneration and cancer pull on the same levers.',
      hook: 'Cells that divide fast, change identity and ignore their usual limits: that describes both regeneration and a tumour.',
      status: 'inferred',
      explanation: [
        'Many of the molecular signals that drive regeneration — pathways that tell cells to divide or to become less specialised — are the same signals that go wrong in cancer.',
        'Yet salamanders seem to keep regeneration under tight control. Experiments have reported that regenerating tissue can suppress tumour growth in some species, though the evidence is limited.',
        'For a regenerating human, the open question is control: how to turn growth on precisely where it is needed, and off again when the job is done.',
      ],
      facts: [
        {
          status: 'established',
          text: 'Signalling pathways such as Wnt are involved in both tissue regeneration and many cancers.',
        },
        {
          status: 'inferred',
          text: 'Some salamander studies report surprisingly low tumour rates, possibly linked to how tightly they regulate growth.',
        },
        {
          status: 'hypothetical',
          text: 'Whether enhanced human regeneration would raise or lower cancer risk overall is unknown.',
        },
      ],
      conclusion: {
        title: 'The hard part isn’t growth — it’s control.',
        summary: [
          'Humans already regenerate in small ways: liver tissue, skin, fingertips in children. The gap to axolotl-level regrowth is a gap in coordination — positional memory, nerve signals and the right immune response.',
          'Switching those programmes on is only half the challenge. The same signals drive cancer, so any regeneration would need precise brakes.',
        ],
        numbers: [
          { value: 'up to ~70%', label: 'Of a human liver can be removed and regrow', status: 'established' },
          { value: '4 digits', label: 'An axolotl rebuilds on each forelimb, in order', status: 'established' },
          { value: '0', label: 'Known ways to regrow a human limb today', status: 'established' },
        ],
        takeaway: 'To rebuild a body, cells must know not just how to grow, but when to stop.',
      },
    },
    'evolution': {
      id: 'evolution',
      label: 'Evolution',
      title: 'Mammals may have traded regeneration for fast, safe healing.',
      hook: 'If regrowing a limb is so useful, why can only a few animals do it?',
      status: 'hypothetical',
      explanation: [
        'One idea is speed. For a warm-blooded animal, an open wound is a route for infection, and a fast scar closes it in days. Rebuilding a limb takes weeks to months.',
        'Another is the immune system: mammals mount strong inflammatory responses that favour scarring. Larger bodies and faster metabolisms may also make regrowth more costly.',
        'Mammals haven’t lost regeneration entirely. African spiny mice can regrow skin, hair follicles and ear tissue without scarring, and deer regrow their antlers every year.',
      ],
      highlight: {
        value: '≈ 2 cm/day',
        label: 'Growth rate of deer antlers — among the fastest-growing tissues in any mammal',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'African spiny mice (Acomys) can regenerate skin and ear tissue without forming scars.',
        },
        {
          status: 'established',
          text: 'Deer antlers are fully regrown bone, regenerated every year.',
        },
        {
          status: 'hypothetical',
          text: 'Why most mammals lost limb regeneration is not settled; the trade-offs above are leading hypotheses, not proven explanations.',
        },
      ],
      conclusion: {
        title: 'Regeneration isn’t missing from mammals — it’s mostly switched off.',
        summary: [
          'The genes and many of the cell behaviours behind regeneration still exist in mammals. Spiny mice and deer antlers show that mammalian tissue can rebuild under the right conditions.',
          'Evolution seems to have favoured fast scarring over slow rebuilding. A regenerating human would be undoing that trade-off — and would have to manage its costs.',
        ],
        numbers: [
          { value: '≈ 2 cm/day', label: 'Deer antler growth', status: 'established' },
          { value: 'up to ~70%', label: 'Of a human liver that can regrow', status: 'established' },
          { value: 'Weeks', label: 'For an axolotl limb, versus days to close a wound with a scar', status: 'established' },
        ],
        takeaway: 'Our scars are an evolutionary choice of speed over perfection.',
      },
    },
  },
};

export default content;
