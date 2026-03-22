import { ORDER_STATUSES } from '../utils/orderUtils'

export default function OrderStepper({ currentStatus }) {
  const currentIdx = ORDER_STATUSES.indexOf(currentStatus)

  return (
    <div className="stepper" id="order-stepper">
      {ORDER_STATUSES.map((status, idx) => {
        const isCompleted = idx < currentIdx
        const isActive = idx === currentIdx
        return (
          <div key={status} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="stepper-dot">
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="stepper-label">{status}</div>
            </div>
            {idx < ORDER_STATUSES.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
