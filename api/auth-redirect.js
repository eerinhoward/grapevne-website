export default function handler(req, res) {
  const link = req.query.link;
  if (!link) {
    res.status(400).send('Missing link parameter');
    return;
  }
  res.redirect(302, link);
}
