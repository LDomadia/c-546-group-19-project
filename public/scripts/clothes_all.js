// const deleteBtns = document.getElementsByClassName('delete-btn');

// if (deleteBtns) {
//     for (let i = 0; i < deleteBtns.length; i++) {
//         deleteBtns[i].addEventListener('click', function() {
//             Swal.fire({
//                 title: 'Are you sure?',
//                 text: "You won't be able to revert this!",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes, delete it!'
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     let id = this.parentElement.parentElement.id.substring(1);
//                     console.log(id);
//                     Swal.fire(
//                         'Deleted!',
//                         'Your file has been deleted.',
//                         'success'
//                     )
//                 }
//             })
//         })
//     }
// }

(function($) {
    const deleteBtns = $('.delete-btn');
    console.log(deleteBtns);
    if (deleteBtns) {
        for (let i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].addEventListener('click', function() {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let id = this.parentElement.parentElement.id.substring(1);
                        console.log(id);
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }
                })
            })
        }
    }
})(window.jQuery);