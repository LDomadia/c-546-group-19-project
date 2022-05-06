(function($) {
    const deleteBtns = $('.delete-btn');
    if (deleteBtns) {
        for (let i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].addEventListener('click', function(event) {
                event.preventDefault();
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
                        const requestConfig = {
                            method: 'DELETE',
                            url: this,
                        }
                        $.ajax(requestConfig).then(function(result) {
                            if (result.result == 'success') {
                                Swal.fire(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                ).then(result => {
                                    location.reload();
                                });
                            }
                            else {
                                Swal.fire(
                                    'Oh no!',
                                    'An error occurred deleting this clothing item.',
                                    'error'
                                );
                            }
                        })
                    }
                })
            })
        }
    }
})(window.jQuery);