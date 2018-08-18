import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(values) {
    console.log('Current State is: ' + JSON.stringify(values));
    // alert('Current State is: ' + JSON.stringify(values));
    this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render() {
    return (
      <div>
        <Button outline onClick={this.toggle}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <div className="form-group">
                <Label>Rating</Label>
                <Control.select model=".rating" name="rating"
                  className="form-control">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Control.select>
              </div>
              <div className="form-group">
                <Label htmlFor="author">Your Name</Label>
                <Control.text model=".author" name="author" id="author" className="form-control"
                  validators={{
                    required, minLength: minLength(3), maxLength: maxLength(15)
                  }} />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  messages={{
                    required: 'Required',
                    minLength: 'Must be greater than 2 characters',
                    maxLength: 'Must be 15 characters or less'
                  }} />
              </div>
              <div className="form-group">
                <Label htmlFor="comment">Comment</Label>
                <Control.textarea model=".comment" name="comment" id="comment" className="form-control" rows="6"
                  validators={{
                    required
                  }} />
                <Errors
                  className="text-danger"
                  model=".comment"
                  show="touched"
                  messages={{
                    required: 'Required'
                  }} />
              </div>
              <Button type="submit" color="primary">Submit</Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function  RenderDish({ dish }) {
  return (
    <div className="col-12 col-md-5 m-1">
      <FadeTransform
        in
        transformProps={{
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
    </div>
  );
}

function RenderComments({ comments, postComment, dishId }) {
  if (comments) {
    return (
      <div className="col-12 col-md-5 m-1">
        <h4>Comments</h4>
        <ul className="list-unstyled">
          <Stagger in>
          {
            comments.map(comment => {
              return (
                <li key={comment.id}>
                  <p>{comment.comment}</p>
                  <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date))) }</p>
                </li>
              );
            })
          }
          </Stagger>
        </ul>
        <CommentForm dishId={dishId} postComment={postComment} />
      </div>);
  } else {
    return <div></div>;
  }
}

const DishDetail = (props) => {
  const { dish, comments, postComment, isLoading, errMess } = props;

  if (isLoading) {
      return (
        <div className="container">
          <div className="row">
            <Loading />
          </div>
        </div>
      );
  } else if (errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{ errMess }</h4>
        </div>
      </div>
    );
  } else if (dish) {
    return (
    <div className="container">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
          <BreadcrumbItem active>{dish.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <h3>{dish.name}</h3>
          <hr />
        </div>
      </div>
      <div className="row">
        <RenderDish dish={dish} />
        <RenderComments comments={comments} postComment={postComment} dishId={dish.id} />
      </div>
    </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}

export default DishDetail;