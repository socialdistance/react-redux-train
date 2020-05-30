import React, { Component } from "react";

import { connect } from "react-redux";

import BookListItem from "../book-list-item";
import Spinner from "../spinner";
import ErrorIndicator from "../error-indicator";

import { withBookstoreService } from "../hoc";
import {
  booksLoaded,
  booksRequested,
  booksError,
  bookAddedToCart,
} from "../../actions";

import "./book-list.css";

const BookList = ({ books, onAddedToCart }) => {
  return (
    <ul className="book-list">
      {books.map((book) => {
        return (
          <li key={book.id}>
            <BookListItem
              book={book}
              onAddedToCart={() => onAddedToCart(book.id)}
            />
          </li>
        );
      })}
    </ul>
  );
};

class BookListContainer extends Component {
  componentDidMount() {
    // 1. recive data
    // const { bookstoreService } = ;

    this.props.booksRequested();
    // 2. dispatch data to store
    this.props.bookstoreService // from context
      .getBooks()
      .then((data) => this.props.bookLoaded(data)) // props from mapDispatchToProps
      .catch((err) => this.props.booksError(err)); // props from mapDispatchToProps
  }

  render() {
    const { books, loading, error, onAddedToCart } = this.props;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <ErrorIndicator />;
    }

    return <BookList books={books} onAddedToCart={onAddedToCart} />;
  }
}

const mapStateToProps = (state) => {
  return {
    books: state.books,
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bookLoaded: (newBooks) =>
      // dispatch({
      //   type: "BOOKS_LOADED",
      //   payload: newBooks,
      // }),
      dispatch(booksLoaded(newBooks)),
    booksRequested: () => {
      dispatch(booksRequested());
    },
    booksError: (error) => {
      dispatch(booksError(error));
    },
    onAddedToCart: (id) => {
      dispatch(bookAddedToCart(id));
    },
  };
};

export default withBookstoreService()(
  connect(mapStateToProps, mapDispatchToProps)(BookListContainer)
);
