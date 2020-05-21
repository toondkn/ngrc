import React from 'react'
import PropTypes from 'prop-types'

function HelloReact({
    style,
    count,
    amount,
    handleIncrement,
    ...props
}) {
    return (
        <div
            style={{ padding: 16, backgroundColor: 'dodgerblue', ...style }}
            {...props}
        >
            <h1>
                Hello from react!
            </h1>
            <p>
                count: {count}
            </p>
            <button
                onClick={() => { handleIncrement(count + amount) }}
            >
                + {amount}
            </button>
        </div>
    )
}
HelloReact.propTypes = {
    count: PropTypes.number,
    amount: PropTypes.number,
    handleIncrement: PropTypes.func,
}

export default HelloReact