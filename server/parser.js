function parseApplicationEmail(email) {
  const { subject, body, date } = email;

  // Pozisyon adı (ilk <a> etiketi, genellikle pozisyon)
  const positionMatch = body.match(/<a [^>]*>([^<]+)<\/a>/i);
  const position = positionMatch ? positionMatch[1].trim() : null;

  // Şirket adı (önce <p> etiketi, yoksa subject'tan)
  let company = null;
  const companyMatch = body.match(/<p [^>]*>([^·<]+) ·/i);
  if (companyMatch) {
    company = companyMatch[1].trim();
  } else {
    const subjectCompanyMatch = subject.match(/your application was sent to (.+)/i);
    if (subjectCompanyMatch) {
      company = subjectCompanyMatch[1].trim();
    }
  }

  // Başvuru tarihi
  const dateMatch = body.match(/Applied on ([^<]+)</i);
  const appliedAt = dateMatch ? new Date(dateMatch[1].trim()) : new Date(date);

  return {
    company_name: company,
    position_title: position,
    applied_at: appliedAt
  };
}

module.exports = { parseApplicationEmail };
  