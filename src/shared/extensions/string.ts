interface String {
  toSlug(): string;
}

String.prototype.toSlug = function(): string {
  return this.replace(/(FC|AFC|&)/g, '').toLowerCase().replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/ /g,'-').replace(/[^\w-]+/g,'');
};
