$(document).ready(function() {
    $('#addSupplier').click(function() {
        $('#supplierModal').modal('show');
        $('#supplierForm')[0].reset();
        $('.modal-title').html("<i class='fa fa-plus'></i> Agregar Cliente");
        $('#action').val("Agregar");
        $('#btn_action').val("addSupplier");
    });
    var supplierDataTable = $('#supplierList').DataTable({
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: "action.php",
            type: "POST",
            data: { action: 'supplierList' },
            dataType: "json"
        },
        "columnDefs": [{
            "target": [0, 5],
            "orderable": false
        }],
        "pageLength": 25,
        'rowCallback': function(row, data, index) {
            $(row).find('td').addClass('align-middle')
            $(row).find('td:eq(0), td:eq(4), td:eq(5)').addClass('text-center')
        },
    });

    $(document).on('submit', '#supplierForm', function(event) {
        event.preventDefault();
        $('#action').attr('disabled', 'disabled');
        var formData = $(this).serialize();
        $.ajax({
            url: "action.php",
            method: "POST",
            data: formData,
            success: function(data) {
                $('#supplierForm')[0].reset();
                $('#supplierModal').modal('hide');
                $('#alert_action').fadeIn().html('<div class="alert alert-success">' + data + '</div>');
                $('#action').attr('disabled', false);
                supplierDataTable.ajax.reload();
            }
        })
    });

    $(document).on('click', '.update', function() {
        var supplier_id = $(this).attr("id");
        var btn_action = 'getSupplier';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { supplier_id: supplier_id, btn_action: btn_action },
            dataType: "json",
            success: function(data) {
                $('#supplierModal').modal('show');
                $('#supplier_name').val(data.supplier_name);
                $('#address').val(data.address);
                $('#mobile').val(data.mobile);
                $('.modal-title').html("<i class='fa fa-edit'></i> Editar Proveedor");
                $('#supplier_id').val(supplier_id);
                $('#action').val('Actualizar');
                $('#btn_action').val('updateSupplier');
            }
        })
    });

    $(document).on('click', '.delete', function() {
        var supplier_id = $(this).attr("id");
        var btn_action = "deleteSupplier";
        if (confirm("¿Está seguro de que desea eliminar este proveedor?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: { supplier_id: supplier_id, btn_action: btn_action },
                success: function(data) {
                    supplierDataTable.ajax.reload();
                }
            })
        } else {
            return false;
        }
    });

});