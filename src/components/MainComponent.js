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
import { postComment, fetchComments, fetchDishes, fetchPromos, fetchLeaders, postFeedback} from '../redux/ActionCreator';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

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
  fetchLeaders: ()=>{dispatch(fetchLeaders())},
  resetFeedbackForm: () =>{dispatch(actions.reset("feedback"))},
  postFeedback: (firstname, lastname, telnum, email, agree, contactType, 
    message) => dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message)),
});

class Main extends React.Component {
  constructor(props){
    super(props)

  }

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render(){
    const HomePage = () => {
      return(
          <Home dish={this.props.dishes.dishes.filter((dish)=>dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMsg={this.props.dishes.errmsg}
          promotion={this.props.promotions.promotions.filter((promo)=>promo.featured)[0]}
          promosLoading={this.props.promotions.isLoading}
          promosErrMsg={this.props.promotions.errmsg}
          leader={this.props.leaders.leaders.filter((leader)=>leader.featured)[0]}
          leadersLoading={this.props.leaders.isLoading}
          leadersErrMsg={this.props.leaders.errmsg}
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
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route path='/home' component={HomePage} />
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route exact path='/aboutus' component={()=> <About leaders={this.props.leaders}/>} />
              <Route path='/menu/:dishId' component={DishWithId}/>
              <Route exact path='/contactus' component={()=><Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm}/>}/>
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
