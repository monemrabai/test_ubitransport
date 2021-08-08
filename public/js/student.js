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

                    $('#students').DataTable().ajax.reload();

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

                    $('#students').DataTable().ajax.reload();
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

    var studentTable = $("#students").DataTable({
        serverSide: true,
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

    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });

    var gradesEditor = new $.fn.dataTable.Editor({
        ajax: {

            create: {
                type: 'POST',
                url: '/api/grades',
                table: "#grades",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: function (datas) {
                    var myJsonObj;
                    myJsonObj = datas.data[0];
                    delete myJsonObj.id;
                    myJsonObj = JSON.stringify(myJsonObj);

                    $('#students').DataTable().ajax.reload();

                    return myJsonObj;
                }
            },
            edit: {
                type: 'PUT',
                url: 'api/grades/{id}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: function (datas) {
                    var myJsonObj;
                    myJsonObj = datas.data;
                    myJsonObj = myJsonObj[Object.keys(myJsonObj)[0]];
                    myJsonObj = JSON.stringify(myJsonObj);

                    $('#grades').DataTable().ajax.reload();
                    return myJsonObj;
                }
            },
            remove: {
                type: 'DELETE',
                url: 'api/grades/{id}'
            }
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
            type: "select",
            placeholder: "Sélectionner un élève"
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

    // Edit record
    $('#grades').on('click', 'td.editor-grade-edit', function (e) {
        e.preventDefault();

        gradesEditor.edit($(this).closest('tr'), {
            title: 'Modifier une note',
            buttons: 'Enregistrer'
        });
    });

    // Delete a record
    $('#grades').on('click', 'td.editor-grade-delete', function (e) {
        e.preventDefault();

        gradesEditor.remove($(this).closest('tr'), {
            title: 'Supprimer une note',
            message: 'Êtes-vous sûr de vouloir supprimer cet enregistrement ?',
            buttons: 'Supprimer'
        });
    });

    var gradesTable = $('#grades').DataTable({
        ajax: {
            serverSide: true,
            dom: "Bfrtip",
            url: '/api/grades',
            type: 'GET',
            'headers': {'Accept': "application/ld+json"},
            data: function (d) {
                var selected = studentTable.row({selected: true});

                if (selected.any()) {
                    d.student = selected.data().id;
                }
            },
            'dataFilter': function (data) {

                var json = JSON.parse(data);
                json.recordTotal = json['hydra:totalItems'];
                json.recordsFiltered = json['hydra:totalItems'];
                json.data = json['hydra:member'];

                return JSON.stringify(json);
            }
        },
        columns: [
            {data: 'id', 'visible': false},
            {data: 'value'},
            {data: 'subject'},
            {
                data: null,
                render: function (data, type, row) {
                    return row.student.firstName + ' ' + row.student.lastName;
                }
            },
            {
                data: null,
                className: "dt-center editor-grade-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-grade-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            }
        ]
    });
    studentTable.on('select', function (e) {
        gradesTable.ajax.reload();
        gradesEditor
            .field('student')
            .def(studentTable.row({selected: true}).data().id);
    });

    studentTable.on('deselect', function () {
        gradesTable.ajax.reload();
    });

    gradesEditor.on('submitSuccess', function () {
        studentTable.ajax.reload();
    });

    studentEditor.on('submitSuccess', function () {
        gradesTable.ajax.reload();
    });
});