import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { actions } from 'react-redux-form';

import Home from './HomeComponent';
import Menu from './MenuComponent';
import About from './AboutComponent';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent.js';
import Footer from './FooterComponent.js';
import Contact from './ContactComponent';
import { postComment, fetchComments, fetchDishes, fetchPromos} from '../redux/ActionCreator';

const mapStateToProps=(state)=>{
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
  }
}

const mapDispatchToProps=(dispatch)=>({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  fetchDishes: ()=>{dispatch(fetchDishes())},
  fetchComments: ()=>{dispatch(fetchComments())},
  fetchPromos: ()=>{dispatch(fetchPromos())},
  resetFeedbackForm: () =>{dispatch(actions.reset("feedback"))}
});

class Main extends React.Component {
  constructor(props){
    super(props)

  }

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }

  render(){
    const HomePage = () => {
      return(
          <Home dish={this.props.dishes.dishes.filter((dish)=>dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMsg={this.props.dishes.errMsg}
          promotion={this.props.promotions.promotions.filter((promo)=>promo.featured)[0]}
          promosLoading={this.props.promotions.isLoading}
          promosErrMsg={this.props.promotions.errMsg}
          leader={this.props.leaders.filter((leader)=>leader.featured)[0]}
          />
      );
    }

    const DishWithId = ({match}) => {
      return(
          <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
            isLoading={this.props.dishes.isLoading}
            errMsg={this.props.dishes.errMsg}
            comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
            commentsErrMsg={this.props.comments.errMsg}
            postComment={this.props.postComment} 
          />
      );
    };

    return (
      <div>
        <Header/>
        <Switch>
              <Route path='/home' component={HomePage} />
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route exact path='/aboutus' component={()=> <About leaders={this.props.leaders}/>} />
              <Route path='/menu/:dishId' component={DishWithId}/>
              <Route exact path='/contactus' component={()=><Contact resetFeedbackForm={this.props.resetFeedbackForm}/>}/>
              <Redirect to="/home" />
          </Switch>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
