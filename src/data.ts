import { QuizQuestion } from "./types";

export const initialQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: "Security",
    question: "Have you ever noticed those tiny ridged lines on the edges of metal coins? Why did ancient rulers first carve them there?",
    options: [
      "To help people grip coins in the rainy weather 🌧️",
      "To stop sneaky thieves from shaving precious silver off the edges! ✂️",
      "To make a beautiful musical jingle when shaken in leather pouches 🎶",
      "To help sight-impaired merchants buy and sell goods 👁️"
    ],
    correctAnswerIndex: 1,
    childHint: "Think about what ancient coins were actually made of! They weren't just tokens; they were made of real, shiny treasures like gold and silver.",
    adultDetail: "Known as 'reeding', this security feature was introduced in the late 17th century. Since coins were minted from precious metals, fraudsters would shave off the outer borders ('coin clipping') to melt down and sell, while still spending the original face value. The pattern immediately exposed clipped coins.",
    pedagogicalGoal: "Introduces physical security in money design, connecting hands-on numismatic observation with the economic concept of intrinsic vs. face value.",
    galleryItemSuggestion: "Display next to the 16th-century clipped silver crowns and the master milled edge coin presses."
  },
  {
    id: 2,
    category: "Commodity",
    question: "Long before shiny metal coins and colorful paper bills were invented, how did early civilizations buy their food?",
    options: [
      "With buckets of polished river mud and pretty tree leaves 🍂",
      "With rare sea shells, Blocks of Salt, and cocoa beans! 🐚",
      "With butterfly cocoons and colorful bird feathers 🦋",
      "With wooden measuring spoons and carved pebbles 🌸"
    ],
    correctAnswerIndex: 1,
    childHint: "Early money had to be durable, hard to find, and useful to almost everyone so they would agree to accept it in a trade!",
    adultDetail: "This is known as 'commodity money'. Across Asia and Africa, Cowrie shells served as official tender for centuries. In ancient Rome, soldiers were sometimes paid in highly valued salt blocks (giving birth to the word 'salary' from the Latin 'salarium').",
    pedagogicalGoal: "Teaches the characteristics of commodity money (durability, relative scarcity, intrinsic usefulness) and shows why metallic currency eventually succeeded it.",
    galleryItemSuggestion: "Display next to our collection of Maldives Cowrie Shell trade cases and Roman Salarium salt-mould specimens."
  },
  {
    id: 3,
    category: "Paper Money",
    question: "Paper money was originally invented in ancient China because of a very heavy headache. What was the major problem?",
    options: [
      "Carrying enough heavy iron coins to buy lunch would break wagons and tire horses! 🐴",
      "Metal coins kept attracting lightning during hot summer thunderstorms ⚡",
      "Mice kept chewing through the merchant's wooden lockboxes 🐭",
      "Clinking coins made so much noise that pirates could hear them from miles away! 🏴‍☠️"
    ],
    correctAnswerIndex: 0,
    childHint: "Imagine going shopping, but the change in your pocket weighs more than a refrigerator! How would you bring it home?",
    adultDetail: "During the Song Dynasty (11th century), iron coins were so low in individual value that carrying 1,000 iron coins weighed nearly 100 pounds. Merchants began leaving their heavy coins with trusted deposit houses, trading lightweight paper receipts instead—the birth of banknotes (known as 'Jiaozi' or flying money).",
    pedagogicalGoal: "Explains the transition from commodity/intrinsic money to representative paper currency based on convenience, storage safety, and transaction cost reduction.",
    galleryItemSuggestion: "Pair with the Song Dynasty copper plate printing blocks and the Emperor Kublai Khan Great Ming Treasury note (circa 1375)."
  },
  {
    id: 4,
    category: "Inflation",
    question: "If you had a time-travel machine and zoomed back 100 years, your $10 bill could buy you 10 hot giant pizzas. Today, that same bill might buy you just one slice! Why?",
    options: [
      "Modern pizza bakers have grown lazier and take longer to work 🍕",
      "Modern pizzas are created using secret radioactive space ingredients 🚀",
      "Inflation naturally raises prices over time, making each dollar buy less 🎈",
      "People inside the 1920s refused to eat cheese, so bread was nearly free 🧀"
    ],
    correctAnswerIndex: 2,
    childHint: "Over time, general prices creep up slowly across the country. It is not that the pizza itself changed; it is that the value of each dollar slipped.",
    adultDetail: "This illustrates 'inflation' and 'purchasing power'. When the total supply of money grows faster than the collection of goods being produced, individual currency units lose purchasing power. A historical price tracker makes this microeconomic concept deeply vivid.",
    pedagogicalGoal: "De-mystifies the complex macroeconomic topic of inflation and price fluctuation using a relatable food anchor for children and chronological metrics for adults.",
    galleryItemSuggestion: "Position next to our interactive 100-year commodity shopping cart, allowing visitors to weigh standard food goods from 1926 vs today."
  },
  {
    id: 5,
    category: "Exchange Rates",
    question: "When traveling overseas, you must trade your local dollars for their local euros or yen. What calculates how much they are worth?",
    options: [
      "The airport airport security guard guesses your luck ✈️",
      "How polite and friendly you are to the local bank teller 🏦",
      "The Exchange Rate, which is like a financial tug-of-war between two economies 🎛️",
      "The total weight of your luggage at the ticket desk 🧳"
    ],
    correctAnswerIndex: 2,
    childHint: "It's like a scale between two nations. One side goes up or down depending on how strong and safe each country's business is on that day!",
    adultDetail: "Exchange rates fluctuate 24/7 on global currency markets. Relative exchange rates represent how much one economy is trusted, its inflation rates, interest policy, trading balance, and political stability compared to another.",
    pedagogicalGoal: "Underlines how currency acts as a national asset that travels across global boundaries, introducing foreign trade, floating values, and international relations.",
    galleryItemSuggestion: "Place adjacent to the mechanical world currency exchange ticker board reflecting real-time currency conversions."
  }
];
