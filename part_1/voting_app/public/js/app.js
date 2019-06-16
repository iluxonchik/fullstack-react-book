class Product extends React.Component {
    handleUpVote = () => {
        this.props.onVote(this.props.id)
    }

    render() {
        return (
            <div className='item'>
                <div className='image'>
                    <img src={this.props.productImageUrl} />
                </div>
                <div className='middle aligned content'>
                    <div className='header'>
                        <a onClick={this.handleUpVote}>
                            <i className='large caret up icon' />
                        </a>
                        {this.props.votes}
                    </div>
                    <div className='description'>
                        <a href={this.props.url}>
                            {this.props.title}
                        </a>
                        <p>
                            {this.props.description}
                        </p>
                    </div>
                    <div className='extra'>
                        <span>Submitted by:</span>
                        <img
                            className='ui avatar image'
                            src={this.props.submitterAvatarUrl}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class ProductList extends React.Component {
    /*  With propoerty initilizers, the constructor is not needed anymore.
        I'm keeping this commendted out and not deleting it, because of the
        NOTE.

        With property initializers, by using arrow functions, this becomes 
        automatically bound to the current component, so there is no need
        to do the .bind() within the constructor.

    constructor(props) {
        super(props);

        // NOTE: modifying state directly like this, via an =, is only
        // allowed in the constructor. Anywehre else, this.setState() should
        // be used, as it will call the necessary methods, such as the ones 
        // that trigger the react components to re-render.
        this.state = {
            products: [],
        };

        this.handleProductUpVote = this.handleProductUpVote.bind(this);
    }
    */
    
    state = {
        products: [],
    };

    componentDidMount() {
        this.setState({ products: Seed.products });
    }

    handleProductUpVote = (productId) => {
        const nextProducts = this.state.products.map((product) => {
            if (product.id === productId) {
                return Object.assign({}, product, {
                    votes: product.votes + 1,
                });
            } else {
                return product;
            }
        });
        this.setState({
            products: nextProducts,
        });
    }

    render() {
        const products = this.state.products.sort((a, b) => (
            b.votes - a.votes
        ));
        const productComponents = products.map((product) => (
                <Product
                    key={'product-' + product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    url={product.url}
                    votes={product.votes}
                    submitterAvatarUrl={product.submitterAvatarUrl}
                    productImageUrl={product.productImageUrl}
                    onVote={this.handleProductUpVote}
                />
        ));
        return(
            <div className='ui unstackable items'>
               {productComponents} 
            </div>
        );
    }
}

ReactDOM.render(
    <ProductList />,
    document.getElementById('content')
);