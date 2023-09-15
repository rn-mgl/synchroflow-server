const avatars = [
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689855/synchroflow-uploads/synchroflow%20avatars/angry-man_1_faed0c.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689855/synchroflow-uploads/synchroflow%20avatars/man-with-spike-hair_i9oxgm.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689855/synchroflow-uploads/synchroflow%20avatars/stylish-man_kcnv9n.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689855/synchroflow-uploads/synchroflow%20avatars/man-with-unique-hair-style_ixfbi0.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689855/synchroflow-uploads/synchroflow%20avatars/monster_qy8thi.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689854/synchroflow-uploads/synchroflow%20avatars/girl-using-smartphone_uatude.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689854/synchroflow-uploads/synchroflow%20avatars/lady_qi2tit.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689853/synchroflow-uploads/synchroflow%20avatars/business-woman_lxaziv.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689853/synchroflow-uploads/synchroflow%20avatars/mustache-man-holding-tea-cup_taniqa.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689853/synchroflow-uploads/synchroflow%20avatars/girl-using-smartphone_1_qkpzea.svg",
  "https://res.cloudinary.com/dnzuptxvy/image/upload/v1694689853/synchroflow-uploads/synchroflow%20avatars/man-playing-video-game_emzr1a.svg",
];

export const randomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};
