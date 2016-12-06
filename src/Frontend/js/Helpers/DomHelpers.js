/**
 * This is the DomHelpers class
 *
 * This contains methods that allow me to manipulate the DOM
 * easily
 */
class DomHelpers {
    /**
     * Constructs the DomHelpers class and registers all
     * dependencies
     *
     * @return void
     */
    constructor(container = 'na') {
        this.DomContainer = container;
    }

    /**
     * Sets the container element
     *
     * @param container
     */
    setContainer(container) {
        this.DomContainer = container;

        return new DomHelpers(container);
    }

    /**
     * This empties the container
     *
     * @return {DomHelpers}
     */
    clear() {
        this.DomContainer.innerHTML = '';

        return this;
    }

    /**
     * Replaces the containers innerHTML with a template string
     *
     * @param template
     * @returns {DomHelpers}
     */
    replace(template) {
        this.DomContainer.innerHTML = template;

        return this;
    }

    /**
     * Appends a template string to the provided container
     *
     * @param template
     * @returns {DomHelpers}
     */
    append(template) {
        this.DomContainer.innerHTML = this.DomContainer.innerHTML + template;

        return this;
    }


}