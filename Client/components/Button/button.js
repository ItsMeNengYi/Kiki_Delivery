export default class controlButton {

    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign(
            {
                width: 100,
                height: 100,
                color: 'gray',
                handleColor: 'white',
                handleRadius: 20,
                onChange: null,
            },
            options
        );
    }

}