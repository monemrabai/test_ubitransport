$.fn.dataTable.render.moment = function (from, to, locale) {
    // Argument shifting
    if (arguments.length === 1) {
        locale = 'en';
        to = from;
        from = 'YYYY-MM-DD';
    } else if (arguments.length === 2) {
        locale = 'en';
    }

    return function (d, type, row) {
        if (!d) {
            return type === 'sort' || type === 'type' ? 0 : d;
        }

        var m = window.moment(d, from, locale, true);

        // Order and type get a number value from Moment, everything else
        // sees the rendered value
        return m.format(type === 'sort' || type === 'type' ? 'x' : to);
    };
};

$(document).ready(function () {

    var studentEditor = new $.fn.dataTable.Editor({
        "ajax": {
            'url': '/api/students',
            create: {
                type: 'POST',
                url: '/api/students',
                table: "#students",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: function (datas) {
                    var myJsonObj;
                    myJsonObj = datas.data[0];
                    delete myJsonObj.id;
                    myJsonObj = JSON.stringify(myJsonObj);

                    return myJsonObj;
                }
            },
            edit: {
                type: 'PUT',
                url: 'api/students/{id}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: function (datas) {
                    var myJsonObj;
                    myJsonObj = datas.data;
                    myJsonObj = myJsonObj[Object.keys(myJsonObj)[0]];
                    myJsonObj = JSON.stringify(myJsonObj);

                    return myJsonObj;
                }
            },
            remove: {
                type: 'DELETE',
                url: 'api/students/{id}'
            }
        },
        "table": "#students",
        "idSrc": 'id',
        "fields": [{
            "label": "Id",
            "name": "id"
        }, {
            "label": "Prénom:",
            "name": "firstName"
        }, {
            "label": "Nom:",
            "name": "lastName"
        }, {
            "label": "Data de naissance:",
            "name": "birthDate",
            type: 'datetime',
            displayFormat: 'DD/MM/YYYY',
            wireFormat: 'YYYY-MM-DD',
            fieldInfo: 'd/m/y format'
        }
        ]
    });

    // New record
    $('a.editor-create').on('click', function (e) {
        e.preventDefault();

        studentEditor.create({
            title: 'Ajouter un élève',
            buttons: 'Enregistrer'
        });

        studentEditor.field('id').disable();
        studentEditor.field('id').hide();
    });

    window.editor = studentEditor;

    // Edit record
    $('#students').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();

        studentEditor.edit($(this).closest('tr'), {
            title: 'Modifier un élève',
            buttons: 'Enregistrer'
        });
    });

    // Delete a record
    $('#students').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();

        studentEditor.remove($(this).closest('tr'), {
            title: 'Supprimer un élève',
            message: 'Êtes-vous sûr de vouloir supprimer cet enregistrement ?',
            buttons: 'Supprimer'
        });
    });

    // Average student
    $('#students').on('click', 'td.editor-average', function (e) {
        e.stopPropagation();
        var studentId = studentTable.row($(this).parent()).data().id;

        $.ajax({
            type: "GET",
            url: "api/student/" + studentId + "/average",
            success: function (data) {
                alert(data);
            }
        });
    });

    // Average all students
    $(".editor-average-grades").on('click', function (e) {
        $.ajax({
            type: "GET",
            url: "api/students/average",
            success: function (data) {
                alert(data);
            }
        });
    });

    var studentTable = $("#students").DataTable({
        serverSide: true,
        bFilter: false,
        dom: "Bfrtip",
        ajax: {
            'url': '/api/students',
            'type': 'GET',
            'headers': {'Accept': "application/ld+json"},
            'dataFilter': function (data) {
                var json = JSON.parse(data);
                json.recordTotal = json['hydra:totalItems'];
                json.recordsFiltered = json['hydra:totalItems'];
                json.data = json['hydra:member'];

                //$('#students').DataTable().ajax.reload();

                return JSON.stringify(json);
            }
        },
        columns: [
            {data: 'id', 'visible': false},
            {data: 'firstName'},
            {data: 'lastName'},
            {data: 'birthDate'},
            //{data: 'birthDate', render: $.fn.dataTable.render.moment( 'DD/MM/YYYY' ) },
            {
                data: null,
                className: "dt-center editor-average",
                "defaultContent": "<i class='fa fa-calculator'></i>"
            },
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            }
        ],
        select: {
            style: 'single'
        },
    });

    var gradesEditor = new $.fn.dataTable.Editor({
        ajax: {
            url: '/api/grades',
            data: function (d) {
                var selected = studentTable.row({selected: true});
                if (selected.any()) {
                    d.student = selected.data().id;
                }
            },
            create: {
                type: 'POST',
                url: '/api/grades',
                table: "#grades",
                contentType: "application/ld+json; charset=utf-8",
                dataType: "json",
                data: function (datas) {
                    var myJsonObj;
                    myJsonObj = datas.data[0];
                    myJsonObj.value = parseFloat(myJsonObj.value);
                    myJsonObj.student = '/api/students/' + myJsonObj.student;

                    delete myJsonObj.id;
                    myJsonObj = JSON.stringify(myJsonObj);

                    $('#grades').DataTable().ajax.reload();

                    return myJsonObj;
                }
            },
        },
        table: '#grades',
        "idSrc": 'id',
        fields: [{
            label: "Id:",
            name: "id"
        }, {
            label: "Valeur:",
            name: "value"
        }, {
            label: "Matière:",
            name: "subject"
        }, {
            label: "Elève:",
            name: "student",
            visible: false
        }
        ]
    });

    // New record
    $('a.grade-create').on('click', function (e) {
        e.preventDefault();

        gradesEditor.create({
            title: 'Ajouter une note',
            buttons: 'Enregistrer'
        });

        gradesEditor.field('id').disable();
        gradesEditor.field('id').hide();
    });

    var gradesTable = $('#grades').DataTable({
        ajax: {
            serverSide: true,
            bFilter: false,
            type: 'GET',
            headers: {'Accept': "application/ld+json"},
            'dataFilter': function (data) {
                var selected = studentTable.row({selected: true});

                if (selected.any()) {
                    var json = JSON.parse(data);
                    json.recordTotal = json['hydra:totalItems'];
                    json.recordsFiltered = json['hydra:totalItems'];
                    json.data = json['hydra:member'];

                    return JSON.stringify(json);
                }

                return JSON.stringify([]);
            }
        },
        columns: [
            {data: 'id', 'visible': false},
            {data: 'value'},
            {data: 'subject'}
        ],
        select: true
    });

    studentTable.on('select', function (e) {
        var studentId = studentTable.row({selected: true}).data().id;

        gradesTable.ajax.url("/api/student/" + studentId + "/grades").load();

        gradesEditor
            .field('student')
            .def(studentId);
    });

    gradesEditor.on('submitSuccess', function () {
        studentTable.ajax.reload();
    });

    studentEditor.on('submitSuccess', function () {
        gradesTable.ajax.reload();
    });
});