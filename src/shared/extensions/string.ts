interface String {
  toSlug(): string;
  toName(): string;
}

String.prototype.toSlug = function(): string {
  return this.replace(/(FC|AFC|&)/g, '').toLowerCase().replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

String.prototype.toName = function (): string {
  return this.replace(/(FC|AFC)/g, '').trim();
};
