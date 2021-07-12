const BaseTag = require("./BaseTag");

class PageTitle extends BaseTag {
  render(title, pageNumber, size) {
    // Get options.
    const style = this.keyPathVal(this, "options.titleStyle", "default");
    const divider = this.keyPathVal(this, "options.titleDivider", "-");
    
    // Fallback on `title` in config if no title is set for the page.
    let pageTitle = title || this.siteTitle;

    // Showing page numbers?
    const showPageNumbers = this.showPageNumbers( this.config );

    // Add pagination
    if ( showPageNumbers &&
         pageNumber > 0 &&
        size > 1 ) {
      pageTitle = pageTitle + ` ${divider} Page ` + (pageNumber + 1);
    }

    // Append sitename
    // if we have a title available
    // and unless the title already is the sitename
    // and the style is not minimalistic
    if (title && title != this.siteTitle && style != "minimalistic") {
      pageTitle = `${pageTitle} ${divider} ${this.siteTitle}`;
    }

    return this.entities.encode(pageTitle);
  }

  liquidRender(scope, hash) {
    // Get title from front matter.
    const title =
      typeof scope.contexts[0].renderData !== "undefined" &&
      typeof scope.contexts[0].renderData.title !== "undefined"
        ? scope.contexts[0].renderData.title
        : scope.contexts[0].title;

    // Get page number from pagination.
    const pageNumber = this.keyPathVal(
      scope.contexts[0],
      "pagination.pageNumber",
      0
    );

    // Get page size from pagination.
    const size = this.keyPathVal(scope.contexts[0], "pagination.size", 0);

    // Showing page numbers?
    const showPageNumbers = this.showPageNumbers( this.config, scope.contexts[0].renderData );

    return Promise.resolve(
      showPageNumbers
        ? this.render(title, pageNumber, size)
        : this.render(title, 0, 0)
    );
  }

  nunjucksRender(self, context) {
    // Get title from front matter.
    const title =
      typeof context.ctx.renderData !== "undefined" &&
      typeof context.ctx.renderData.title !== "undefined"
        ? context.ctx.renderData.title
        : context.ctx.title;
        
    // Get page number from pagination.
    const pageNumber = self.keyPathVal(context.ctx, "pagination.pageNumber", 0);

    // Get page size from pagination.
    const size = self.keyPathVal(context.ctx, "pagination.size", 0);

    // Showing page numbers?
    const showPageNumbers = this.showPageNumbers( this.config, context.ctx.renderData );
    
    return showPageNumbers
      ? self.render(title, pageNumber, size)
      : self.render(title, 0, 0);
  }

  showPageNumbers(config, renderData){
     // default
    let showPageNumbers = true;
    
    // global setting
    if ( "options" in config &&
         "showPageNumbers" in config.options ) {
      showPageNumbers = config.options.showPageNumbers;
    }
    
    // page override
    if ( typeof renderData !== "undefined" &&
         typeof renderData.showPageNumbers !== "undefined" ) {
      showPageNumbers = renderData.showPageNumbers;
    }
    
    return showPageNumbers;
  }
}

module.exports = PageTitle;
