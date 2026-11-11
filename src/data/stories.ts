/**
 * DEMO member stories for the prototype's "People speak" section.
 * They are written for the prototype and shown under a "Demo data" label with a note saying so. They are never
 * paired with a real person's photo. At launch, replace them with stories members submit (support form,
 * topic "story") and publish only with each member's written consent (PRD CR-5, safeguarding policy).
 */
export type MemberStory = { name: string; place: string; action: "Tell One" | "Bring One" | "Help One"; role: string; quote: string };

export const memberStories: MemberStory[] = [
  {
    name: "Chiamaka",
    place: "Manchester, UK",
    action: "Tell One",
    role: "Diaspora member",
    quote: "I call my mum in Nnewi every Sunday. Now I send her the WhatsApp message from the site and we talk about the projects on her street, not just prices at the market.",
  },
  {
    name: "Abubakar",
    place: "Kano",
    action: "Bring One",
    role: "Street leader",
    quote: "My neighbour said all politicians are the same. I showed him a project page with every naira listed. He joined that night and brought his brother the next week.",
  },
  {
    name: "Funke",
    place: "Ibadan, Oyo",
    action: "Help One",
    role: "Member and project funder",
    quote: "I gave ₦5,000 towards a borehole repair in a ward I have never visited. Three weeks later I saw the photos of the pump working. That is the first time I have seen where my money went.",
  },
  {
    name: "Emeka",
    place: "Enugu",
    action: "Bring One",
    role: "Ward leader",
    quote: "We hold the village meeting under the mango tree. People come for the theme song and stay for the questions. Nobody is asked how they will vote, only whether they have their card.",
  },
  {
    name: "Hauwa",
    place: "Kaduna",
    action: "Help One",
    role: "Volunteer translator",
    quote: "I translate the weekly message into Hausa. When my aunty heard it in her own language, she said, “Now I understand what they are promising.”",
  },
  {
    name: "Tunde",
    place: "Lagos",
    action: "Tell One",
    role: "Creator",
    quote: "I made a 30-second video in Pidgin about where stolen money goes. The comments were full of people tagging their friends. One video, thousands of conversations.",
  },
];
