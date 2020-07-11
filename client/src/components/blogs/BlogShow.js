import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchBlog } from "../../actions";

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImage() {
    const { imageUrl } = this.props.blog;
    if (imageUrl) {
      return (
        <div className='row'>
          <img
            src={`${process.env.REACT_APP_AWS_S3_URL}${imageUrl}`}
            alt="blog pic"
            className="col s10 offset-s1"
          />
        </div>
      );
    }
  }

  render() {
    if (!this.props.blog) {
      return "";
    }

    const { title, content } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        {this.renderImage()}
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
