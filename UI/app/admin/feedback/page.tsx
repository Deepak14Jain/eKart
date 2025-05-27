import { getAllFeedbacks } from "@/lib/data"

async function FeedbackPage() {
  const feedbacks = await getAllFeedbacks()

  return (
    <div>
      <h1>Feedback</h1>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id}>
            {feedback.text} - {feedback.author}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeedbackPage
