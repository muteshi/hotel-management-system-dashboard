export default function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}
