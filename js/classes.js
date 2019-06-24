class BasicObject {

    constructor(data, links) {
        this.id = data.id;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.links = links;
    }

}

class Machine extends BasicObject {

    constructor(data, links) {
        // Constructor of BasicObject
        super(data, links);
        // Specific actions
        this.brand = data.brand;
        this.model = data.model;
        this.description = data.description;
        this.ubication = data.ubication;
    }

    get short() {
        return this.brand + " " + this.model;
    }

    update(data) {
        this.brand = data.brand;
        this.model = data.model;
        this.description = data.description;
        this.ubication = data.ubication;
        this.updated_at = data.updated_at;
    }

}

class Component extends BasicObject {

    constructor(data, links) {
        // Constructor of BasicObject
        super(data, links);
        // Specific actions
        this.brand = data.brand;
        this.model = data.model;
        this.description = data.description;
        this.machine_id = data.machine_id;
        this.isRoot = data.isRoot;
    }

    get short() {
        return this.machine.short + "::" + this.brand + " " + this.model;
    }

    get machine() {
        var source = this.links['machines'];
        var value = source[this.machine_id];
        if (value == undefined) {
            console.log("Catch me");
            return { short: "( Equipo eliminado )" };
        }
        return value;
    }

    update(data) {
        this.brand = data.brand;
        this.model = data.model;
        this.description = data.description;
        this.machine_id = data.machine_id;
        this.updated_at = data.updated_at;
    }

}

class User extends BasicObject {

    constructor(data, links) {
        // Constructor of BasicObject
        super(data, links);
        // Specific actions
        this.name = data.name;
        this.email = data.email;
        this.isAdmin = data.isAdmin;
        this.hability = data.hability;
    }

    get short() {
        return this.name;
    }

    update(data) {
        this.name = data.name;
        this.email = data.email;
        this.isAdmin = data.isAdmin;
        this.hability = data.hability;
        this.updated_at = data.updated_at;
    }

}

class Task extends BasicObject {

    constructor(data, links) {
        // Constructor of BasicObject
        super(data, links);
        // Specific actions
        this.title = data.title;
        this.description = data.description;
        this.priority = data.priority;
        this.dueDate = new Date(data.dueDate + "T12:00:00-06:00");
        this.isComplete = data.isComplete;
        this.component_id = data.component_id;
        this.user_id = data.user_id;
    }

    get short() {
        return this.title;
    }

    get color() {
        switch (this.priority) {
            case '0':
                return "danger";
            case '1':
                return "warning";
            case '2':
                return "primary";
            default:
                return "info";
        }
    }

    get priorityText() {
        switch (this.priority) {
            case '0':
                return "Importante y urgente";
            case '1':
                return "Importante";
            case '2':
                return "Urgente";
            default:
                return "No prioritario";
        }
    }

    get component() {
        var source = this.links['components'];
        return source[this.component_id];
    }

    get user() {
        var source = this.links['users'];
        return source[this.user_id];
    }

    update(data) {
        this.title = data.title;
        this.description = data.description;
        this.priority = data.priority;
        this.dueDate = new Date(data.dueDate + "T12:00:00-06:00");
        this.isComplete = data.isComplete;
        this.component_id = data.component_id;
        this.user_id = data.user_id;
        this.updated_at = data.updated_at;
    }

}

class Material extends BasicObject {

    constructor(data, links) {
        // Constructor of BasicObject
        super(data, links);
        // Specific actions
        this.brand = data.brand;
        this.model = data.model;
        this.description = data.description;
        this.quantity = data.quantity;
    }

    get short() {
        return this.brand + " " + this.model;
    }

    update(data) {
        this.brand = data.brand;
        this.model = data.model;
        this.description = data.description;
        this.quantity = data.quantity;
        this.updated_at = data.updated_at;
    }

}
