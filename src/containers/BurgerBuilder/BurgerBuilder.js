import React,{Component} from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';




class BurgerBuilder extends Component{

    state = {
        purchasing: false
    }

    componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();

    }

    purchaseCancleHandler = () =>{

        this.setState({purchasing: false});
    }

    purchaseHandler =() =>{
        if (this.props.isAuthenticated){
            this.setState({purchasing: true});
        } else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    updatePurchaseState (ingredients){
        
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            },0);
        return sum > 0;
    }


    purchaseContinueHandler = ()=> {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    };

    render() {
        const disableInfo = {
            ...this.props.ings
        };
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;


        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;
        if (this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disableInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price}/>)
                </Aux>);
            orderSummary =  <OrderSummary
                ingredients={this.props.ings}
                purchaseCanceled={this.purchaseCancleHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancleHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }

}

const mapStateToProps = state => {
    return {
      ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredient()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
};




export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));