import Swal from 'sweetalert2'
import _withReactContent from 'sweetalert2-react-content'

export function withReactContent() {
    return _withReactContent(Swal)
}

export function errorHandler(error) {
    let errorMessage = ""

    if (error.response) {
        if (error.response.data.error) {
            if (error.response.data?.error?.details?.errors) {
                errorMessage = error.response.data.error?.details?.errors[0].message
            } else
                if (error.response.data.error.message) {
                    errorMessage = error.response.data.error.message
                }
        } else if (error.response.data.errors) {
            let errors = error.response.data.errors
            let errorKeys = Object.keys(error.response.data.errors)
            let errorKey = errorKeys[0]
            errorMessage = errors[errorKey]
        } else if (error.response.data.message) {
            if (Array.isArray(error.response.data.message)) {
                errorMessage = error.response.data.message[0]
            } else {
                errorMessage = error.response.data.message
            }
        }
    } else if (error.message) {
        errorMessage = error.message
    }
    else {
        errorMessage = error.message
    }

    return errorMessage
}