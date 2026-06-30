// Approximate clickable zones over /public/seatmap.jpg, given as percentages
// of the image's width/height (top/left/width/height). These are estimated
// from the layout and may need small tweaks — open the app, click around,
// and adjust the numbers below until the boxes line up with each section.
//
// top/left = position of the box's top-left corner (% of image)
// width/height = size of the box (% of image)

export const SECTIONS = [
  // Row A
  { id: "A1", top: 4.5, left: 17.0, width: 13.0, height: 17.5 },
  { id: "A2", top: 4.5, left: 30.5, width: 18.0, height: 17.5 },
  { id: "A3", top: 4.5, left: 56.5, width: 18.0, height: 17.5 },
  { id: "A4", top: 4.5, left: 75.0, width: 13.0, height: 17.5 },

  // Row B
  { id: "B1", top: 23.5, left: 17.0, width: 13.0, height: 19.5 },
  { id: "B2", top: 23.5, left: 30.5, width: 9.5, height: 19.5 },
  { id: "B3", top: 36.0, left: 41.5, width: 21.0, height: 7.0 },
  { id: "B4", top: 23.5, left: 63.0, width: 12.0, height: 19.5 },
  { id: "B5", top: 23.5, left: 75.0, width: 13.0, height: 19.5 },

  // Row C
  { id: "C1", top: 45.0, left: 17.0, width: 13.0, height: 11.5 },
  { id: "C2", top: 45.0, left: 30.5, width: 9.5, height: 11.5 },
  { id: "C3", top: 45.0, left: 41.5, width: 21.0, height: 11.5 },
  { id: "C4", top: 45.0, left: 63.0, width: 12.0, height: 11.5 },
  { id: "C5", top: 45.0, left: 75.0, width: 13.0, height: 11.5 },

  // Row D
  { id: "D1", top: 60.0, left: 22.5, width: 10.5, height: 13.5 },
  { id: "D2", top: 60.0, left: 33.0, width: 12.5, height: 13.5 },
  { id: "D3", top: 60.0, left: 60.5, width: 11.5, height: 13.5 },
  { id: "D4", top: 60.0, left: 72.5, width: 9.5, height: 13.5 },

  // Row E
  { id: "E1", top: 78.0, left: 25.0, width: 10.5, height: 15.5 },
  { id: "E2", top: 78.0, left: 35.5, width: 16.0, height: 15.5 },
  { id: "E3", top: 78.0, left: 52.5, width: 14.0, height: 15.5 },
  { id: "E4", top: 78.0, left: 67.0, width: 12.5, height: 15.5 },
];

export const EMOJIS = [
  { id: "bear", icon: "🐻", label: "Bear" },
  { id: "panda", icon: "🐼", label: "Panda" },
  { id: "cat", icon: "🐱", label: "Cat" },
  { id: "dog", icon: "🐶", label: "Dog" },
  { id: "orange_heart", icon: "🧡", label: "Orange Heart" },
  { id: "white_heart", icon: "🤍", label: "White Heart" },
  { id: "moon", icon: "🌙", label: "Moon" },
  { id: "star", icon: "⭐", label: "Star" },
];

export const SHOW_DATES = ["Aug 7", "Aug 8", "Aug 9"];
