$(document).ready(function() {
    $('#categoryAdd').click(function() {
        $('#categoryForm')[0].reset();
        $('.modal-title').html("<i class='fa fa-plus'></i> Agregar Categoría");
        $('#action').val('Agregar');
        $('#btn_action').val('categoryAdd');
    });
    var categoryData = $('#categoryList').DataTable({
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: "action.php",
            type: "POST",
            data: { action: 'categoryList' },
            dataType: "json"
        },
        "columnDefs": [{
            "targets": [0, 3],
            "orderable": false,
        }, ],
        "pageLength": 25,
        'rowCallback': function(row, data, index) {
            $(row).find('td').addClass('align-middle')
            $(row).find('td:eq(0), td:eq(3)').addClass('text-center')
        }
    });
    $(document).on('submit', '#categoryForm', function(event) {
        event.preventDefault();
        $('#action').attr('disabled', 'disabled');
        var formData = $(this).serialize();
        $.ajax({
            url: "action.php",
            method: "POST",
            data: formData,
            success: function(data) {
                $('#categoryForm')[0].reset();
                $('#categoryModal').modal('hide');
                $('#alert_action').fadeIn().html('<div class="alert alert-success">' + data + '</div>');
                $('#action').attr('disabled', false);
                categoryData.ajax.reload();
            }
        })
    });
    $(document).on('click', '.update', function() {
        var categoryId = $(this).attr("id");
        var btnAction = 'getCategory';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { categoryId: categoryId, btn_action: btnAction },
            dataType: "json",
            success: function(data) {
                $('#categoryModal').modal('show');
                $('#category').val(data.name);
                $('.modal-title').html("<i class='fa fa-edit'></i> Editar Categoría");
                $('#categoryId').val(categoryId);
                $('#action').val('Editar');
                $('#btn_action').val("updateCategory");
            }
        })
    });
    $(document).on('click', '.delete', function() {
        var categoryId = $(this).attr('id');
        var status = $(this).data("status");
        var btn_action = 'deleteCategory';
        if (confirm("¿Está seguro de que desea eliminar esta categoría?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: { categoryId: categoryId, status: status, btn_action: btn_action },
                success: function(data) {
                    $('#alert_action').fadeIn().html('<div class="alert alert-info">' + data + '</div>');
                    categoryData.ajax.reload();
                }
            })
        } else {
            return false;
        }
    });
});