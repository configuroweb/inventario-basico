$(document).ready(function() {
    var orderData = $('#orderList').DataTable({
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: "action.php",
            type: "POST",
            data: { action: 'listOrder' },
            dataType: "json"
        },
        "pageLength": 10,
        "columnDefs": [{
            "target": [0, 4],
            "orderable": false
        }],
        'rowCallback': function(row, data, index) {
            $(row).find('td').addClass('align-middle')
            $(row).find('td:eq(0), td:eq(4)').addClass('text-center')
        },
    });

    $('#addOrder').click(function() {
        $('#orderModal').modal('show');
        $('#orderForm')[0].reset();
        $('.modal-title').html("<i class='fa fa-plus'></i> Agregar Orden");
        $('#action').val("Add");
        $('#btn_action').val("addOrder");
    });


    $(document).on('submit', '#orderForm', function(event) {
        event.preventDefault();
        $('#action').attr('disabled', 'disabled');
        var formData = $(this).serialize();
        $.ajax({
            url: "action.php",
            method: "POST",
            data: formData,
            success: function(data) {
                $('#orderForm')[0].reset();
                $('#orderModal').modal('hide');
                $('#action').attr('disabled', false);
                orderData.ajax.reload();
            }
        })
    });

    $(document).on('click', '.view', function() {
        var pid = $(this).attr("id");
        var btn_action = 'viewProduct';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { pid: pid, btn_action: btn_action },
            success: function(data) {
                $('#productViewModal').modal('show');
                $('#productDetails').html(data);
            }
        })
    });

    $(document).on('click', '.update', function() {
        var order_id = $(this).attr("id");
        var btn_action = 'getOrderDetails';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { order_id: order_id, btn_action: btn_action },
            dataType: "json",
            success: function(data) {
                $('#orderModal').modal('show');
                $('#product').val(data.product_id);
                $('#shipped').val(data.total_shipped);
                $('#customer').val(data.customer_id);
                $('.modal-title').html("<i class='fa fa-edit'></i> Editar Orden");
                $('#order_id').val(order_id);
                $('#action').val("Editar");
                $('#btn_action').val("updateOrder");
            }
        })
    });

    $(document).on('click', '.delete', function() {
        var order_id = $(this).attr("id");
        var status = $(this).data("status");
        var btn_action = 'deleteOrder';
        if (confirm("¿Está seguro de que desea eliminar esta orden?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: { order_id: order_id, status: status, btn_action: btn_action },
                success: function(data) {
                    orderData.ajax.reload();
                }
            });
        } else {
            return false;
        }
    });
});