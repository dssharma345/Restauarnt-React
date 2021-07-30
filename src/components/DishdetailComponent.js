import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, 
    BreadcrumbItem, ModalHeader, ModalBody, Modal, Button, Row, Label, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import {LocalForm, Control, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components'

function RenderDish({dish}){
    
    return (
        <FadeTransform in
            transfromProps={{
            exitTransform: 'scale(0.5) translateY(-50%)'
            }}>
            <Card>
            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
            </CardBody>
            </Card>
        </FadeTransform>
    );
}


function RenderComments({comments, postComment, dishId}){
    if (comments!=null){
        
        const commentList= comments.map((comment)=>{
            return (
                <Fade in>
                <div key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>--{comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'})
                                                                  .format(new Date(Date.parse(comment.date)))}</p>
                </div>
                </Fade>
            );
        })
        
        return (
            <Stagger in>
            <div>
                {commentList}
                <CommentForm dishId={dishId} postComment={postComment}/>
            </div>
            </Stagger>
        )
    }
    else{
        return <div></div>
    }
}

//validators
const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends React.Component{

    constructor(props){
        super(props)
        this.state={
            isCommentFormModalOpen: false,
        }

        this.toggleCommentFormModal= this.toggleCommentFormModal.bind(this)
        this.handleCommentFormSubmit= this.handleCommentFormSubmit.bind(this)
    }

    toggleCommentFormModal(){
        
        this.setState({
            isCommentFormModalOpen: !this.state.isCommentFormModalOpen
            
        })
        console.log(this.state.isCommentFormModalOpen)
    }

    handleCommentFormSubmit(values){
        this.toggleCommentFormModal()
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment)
    }
    render(){
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleCommentFormModal}>
                    <span className="fa fa-comments fa-lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isCommentFormModalOpen} toggle={this.toggleCommentFormModal}>
                    <ModalHeader toggle={this.toggleCommentFormModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values)=>this.handleCommentFormSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" className="form-control" id="rating" name="rating">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" className="form-control" name="author" 
                                    id="author" placeholder="Your Name" 
                                    validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                    }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            maxLength: 'Must be 15 characters or less',
                                            minLength: 'Must be greater than 2 characters',
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={12}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" className="form-control" name="comment"
                                    id="comment" rows="6"/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" name="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                                
                            </Row>
                        </LocalForm>
                    </ModalBody> 
                </Modal>
            </React.Fragment>
        )
    }
}

const DishDetail=(props)=>{
    if (props.isLoading){
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }

    else if(props.errMsg){
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMsg}</h4>
                </div>
            </div>
        )        
    }
    else if (props.dish != null) {
        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>
    
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments}
                        postComment={props.postComment}
                        dishId={props.dish.id}
                    />
                </div>
            </div>
            </div>
        );
    }
    else {
        return (<div></div>);
    }
    
}

export default DishDetail;