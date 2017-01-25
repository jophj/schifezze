class SchifezzaInlineQueryParser {
  parse(query) {

    const regexp = /(schifezza|premio|meme)\s+(\d+)\s+€\s+(.+)$/;
    const matches = query.match(regexp);
    if (!matches) return null;
    return {
      name: matches[1],
      money: matches[2],
      description: matches[3]
    }
  }
}

module.exports = SchifezzaInlineQueryParser;
