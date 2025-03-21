"use client"

import { createContext, useContext, useState, useEffect } from "react"
import movieReviews from "../lib/reviews"

const ReviewDiaryContext = createContext()

export function ReviewDiaryProvider({ children }) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    setReviews(movieReviews) // Populate with initial data on mount
  }, [])

  const addReview = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews])
  }

  const deleteReview = (reviewId) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId))
  }

  const sortReviews = (order) => {
    setReviews((prevReviews) => {
      const sortedReviews = [...prevReviews].sort((a, b) => {
        const dateA = new Date(a.year, new Date(Date.parse(a.month + " 1, 2000")).getMonth(), a.day)
        const dateB = new Date(b.year, new Date(Date.parse(b.month + " 1, 2000")).getMonth(), b.day)
        return order === "desc" ? dateB - dateA : dateA - dateB
      })
      return sortedReviews
    })
  }

  const getSortedReviews = (order = "desc", limit = null) => {
    const sortedReviews = [...reviews].sort((a, b) => {
      const dateA = new Date(a.year, new Date(Date.parse(a.month + " 1, 2000")).getMonth(), a.day)
      const dateB = new Date(b.year, new Date(Date.parse(b.month + " 1, 2000")).getMonth(), b.day)
      return order === "desc" ? dateB - dateA : dateA - dateB
    })

    return limit ? sortedReviews.slice(0, limit) : sortedReviews
  }

  const updateReview = (updatedReview) => {
    setReviews((prevReviews) => prevReviews.map((review) => (review.id === updatedReview.id ? updatedReview : review)))
  }

  const filterReviewsByRating = (rating) => {
    setCurrentFilter(rating)

    if (rating === null) {
      // If no filter, show all reviews
      setFilteredReviews(reviews)
    } else {
      // Filter reviews by rating
      const filtered = reviews.filter((review) => review.rating === rating)
      setFilteredReviews(filtered)
    }
  }

  return (
    <ReviewDiaryContext.Provider
      value={{
        reviews,
        addReview,
        deleteReview,
        sortReviews,
        getSortedReviews,
        updateReview,
        filterReviewsByRating
      }}
    >
      {children}
    </ReviewDiaryContext.Provider>
  )
}

export function useReviewDiary() {
  return useContext(ReviewDiaryContext)
}
