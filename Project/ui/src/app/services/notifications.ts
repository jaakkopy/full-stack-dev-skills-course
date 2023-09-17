import Swal, { SweetAlertResult } from 'sweetalert2';

export const showSuccessMessage = (msg: string): Promise<SweetAlertResult<any>> => {
    return Swal.fire("Success", msg, "success");
}

export const showFailureMessage = (msg: string): Promise<SweetAlertResult<any>> => {
    return Swal.fire("Error", msg, "error");
}

export const showInfoMessage = (msg: string): Promise<SweetAlertResult<any>> => {
    return Swal.fire("Notification", msg, "info");
}

export const showConfirmation = (text: string): Promise<SweetAlertResult<any>> => {
    return Swal.fire({
        title: 'Are you sure?',
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    });
}

