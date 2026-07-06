async function runPlugin() {
  try {
    figma.notify('Creating shapes and connections...');
    
    const gapX = 500;
    const gapY = 400;
    const nodeWidth = 320;
    const nodeHeight = 100;
    
    // Palette definitions
    const colors = {
      blue: { r: 0.90, g: 0.94, b: 0.99 },    // Pale Blue
      mint: { r: 0.90, g: 0.98, b: 0.94 },    // Pale Mint
      yellow: { r: 1.0, g: 0.98, b: 0.90 },   // Pale Yellow
      gray: { r: 0.95, g: 0.95, b: 0.95 }     // Desaturated Gray for redirects
    };

    const nodesData = [
      // --- CUSTOMER BRANCH ---
      // Section: Customer Authentication (Cols 0-1)
      { id: 'cust_landing', label: 'Landing Page\n(index.html)', col: 0, row: 0, color: 'blue', section: 'cust_auth' },
      { id: 'cust_login', label: 'Login Page\n(login.html)', col: 0, row: 1, color: 'blue', section: 'cust_auth' },
      { id: 'cust_register', label: 'Registration Page\n(register.html)', col: 0, row: 2, color: 'blue', section: 'cust_auth' },
      { id: 'cust_forgot', label: 'Forgot Password\n(forgot_password.html)', col: 1, row: 2, color: 'blue', section: 'cust_auth' },

      // Section: Customer Booking Flow (Cols 2-3)
      { id: 'cust_search', label: 'Search Results\n(search_results.html)', col: 2, row: 0, color: 'mint', section: 'cust_booking' },
      { id: 'cust_details', label: 'Hotel Details\n(hotel_details.html)', col: 2, row: 1, color: 'mint', section: 'cust_booking' },
      { id: 'cust_room_sel', label: 'Room Selection\n(room_selection.html)', col: 2, row: 2, color: 'mint', section: 'cust_booking' },
      { id: 'cust_guest_details', label: 'Guest Details Form\n(guest_details.html)', col: 3, row: 2, color: 'mint', section: 'cust_booking' },
      { id: 'cust_payment', label: 'Payment Portal\n(payment_portal.html)', col: 3, row: 3, color: 'mint', section: 'cust_booking' },
      { id: 'cust_success', label: 'Booking Success\n(booking_success.html)', col: 3, row: 4, color: 'mint', section: 'cust_booking' },
      { id: 'cust_invoice', label: 'Invoice Summary\n(invoice_summary.html)', col: 3, row: 5, color: 'mint', section: 'cust_booking' },

      // Section: Customer Bookings Management (Col 4)
      { id: 'cust_profile', label: 'User Profile\n(profile.html)', col: 4, row: 0, color: 'yellow', section: 'cust_mgmt' },
      { id: 'cust_notifications', label: 'Notifications\n(notifications.html)', col: 4, row: 1, color: 'yellow', section: 'cust_mgmt' },
      { id: 'cust_my_bookings', label: 'My Bookings\n(my_bookings.html)', col: 4, row: 2, color: 'yellow', section: 'cust_mgmt' },
      { id: 'cust_modify_s1', label: 'Modify Booking - Step 1\n(modify_booking_step1.html)', col: 4, row: 3, color: 'yellow', section: 'cust_mgmt' },
      { id: 'cust_modify_s2', label: 'Modify Booking - Step 2\n(modify_booking_step2.html)', col: 4, row: 4, color: 'yellow', section: 'cust_mgmt' },
      { id: 'cust_modify_s3', label: 'Modify Booking - Step 3\n(modify_booking_step3.html)', col: 4, row: 5, color: 'yellow', section: 'cust_mgmt' },
      { id: 'cust_redirect_my_bookings', label: 'Redirect to My Bookings\n(Return to List)', col: 4, row: 6, color: 'gray', section: 'cust_mgmt' },

      // --- HOTEL MANAGER BRANCH ---
      // Section: Hotel Manager Dashboard & Operations (Cols 6-11)
      { id: 'mgr_dashboard', label: 'Manager Dashboard\n(dashboard.html)', col: 8, row: 0, color: 'blue', section: 'mgr_ops' },
      
      // Bookings / Guests
      { id: 'mgr_bookings', label: 'Bookings List\n(bookings.html)', col: 6, row: 1, color: 'mint', section: 'mgr_ops' },
      { id: 'mgr_calendar', label: 'Booking Calendar\n(booking_calendar.html)', col: 6, row: 2, color: 'mint', section: 'mgr_ops' },
      { id: 'mgr_guests', label: 'Guest Directory\n(guests.html)', col: 6, row: 3, color: 'mint', section: 'mgr_ops' },

      // Operations
      { id: 'mgr_housekeeping', label: 'Housekeeping Status\n(housekeeping.html)', col: 7, row: 1, color: 'yellow', section: 'mgr_ops' },
      { id: 'mgr_requests', label: 'Guest Requests\n(requests.html)', col: 7, row: 2, color: 'yellow', section: 'mgr_ops' },

      // Check In/Out
      { id: 'mgr_checkin', label: 'Check-In Portal\n(check_in.html)', col: 8, row: 1, color: 'mint', section: 'mgr_ops' },
      { id: 'mgr_checkout', label: 'Check-Out Portal\n(check_out.html)', col: 8, row: 2, color: 'mint', section: 'mgr_ops' },

      // Room Management
      { id: 'mgr_rooms', label: 'Rooms Directory\n(rooms.html)', col: 9, row: 1, color: 'blue', section: 'mgr_ops' },
      { id: 'mgr_room_types', label: 'Room Types\n(room_types.html)', col: 9, row: 2, color: 'blue', section: 'mgr_ops' },
      { id: 'mgr_room_avail', label: 'Room Availability\n(room_availability.html)', col: 9, row: 3, color: 'blue', section: 'mgr_ops' },

      // Reports
      { id: 'mgr_rep_bookings', label: 'Booking Reports\n(reports_bookings.html)', col: 10, row: 1, color: 'yellow', section: 'mgr_ops' },
      { id: 'mgr_rep_occupancy', label: 'Occupancy Reports\n(reports_occupancy.html)', col: 10, row: 2, color: 'yellow', section: 'mgr_ops' },
      { id: 'mgr_rep_payments', label: 'Payment Reports\n(reports_payments.html)', col: 10, row: 3, color: 'yellow', section: 'mgr_ops' },
      { id: 'mgr_rep_profile', label: 'Report Profile\n(reports_profile.html)', col: 10, row: 4, color: 'yellow', section: 'mgr_ops' },

      // Notifications
      { id: 'mgr_notifications', label: 'Notifications Hub\n(notifications.html)', col: 11, row: 1, color: 'blue', section: 'mgr_ops' },

      // --- SYSTEM ADMIN BRANCH ---
      // Section: System Admin (Cols 13-18)
      { id: 'adm_dashboard', label: 'Admin Dashboard\n(dashboard.html)', col: 15, row: 0, color: 'blue', section: 'adm_ops' },

      // User Mgmt
      { id: 'adm_users', label: 'User Management\n(users.html)', col: 13, row: 1, color: 'mint', section: 'adm_ops' },
      { id: 'adm_add_user', label: 'Add User Form\n(add_user.html)', col: 13, row: 2, color: 'mint', section: 'adm_ops' },
      { id: 'adm_view_user', label: 'View / Edit User\n(view_user.html / edit_manager.html)', col: 13, row: 3, color: 'mint', section: 'adm_ops' },

      // Hotel Mgmt
      { id: 'adm_hotels', label: 'Hotel Management\n(hotels.html)', col: 14, row: 1, color: 'yellow', section: 'adm_ops' },
      { id: 'adm_add_hotel', label: 'Add Hotel Form\n(add_hotel.html)', col: 14, row: 2, color: 'yellow', section: 'adm_ops' },
      { id: 'adm_view_hotel', label: 'View / Edit Hotel\n(view_hotel.html / edit_hotel.html)', col: 14, row: 3, color: 'yellow', section: 'adm_ops' },

      // Monitoring
      { id: 'adm_monitoring', label: 'Booking Monitoring\n(booking_monitoring.html)', col: 15, row: 1, color: 'blue', section: 'adm_ops' },
      { id: 'adm_analytics', label: 'Booking & User Analytics\n(booking_analytics.html / user_analytics.html)', col: 15, row: 2, color: 'blue', section: 'adm_ops' },
      { id: 'adm_perf', label: 'Hotel Performance\n(hotel_performance.html)', col: 15, row: 3, color: 'blue', section: 'adm_ops' },
      { id: 'adm_reports', label: 'System Reports\n(reports.html)', col: 15, row: 4, color: 'blue', section: 'adm_ops' },

      // Content Mgmt
      { id: 'adm_content', label: 'Content Management\n(content.html)', col: 16, row: 1, color: 'mint', section: 'adm_ops' },
      { id: 'adm_edit_layout', label: 'Edit Site Layout / Hero\n(edit_layout.html / edit_hero.html)', col: 16, row: 2, color: 'mint', section: 'adm_ops' },
      { id: 'adm_edit_info', label: 'Edit Site Info\n(edit_about.html / edit_contact.html)', col: 16, row: 3, color: 'mint', section: 'adm_ops' },

      // Backup & Audit
      { id: 'adm_audit', label: 'Audit Logs Viewer\n(audit_logs.html / view_audit.html)', col: 17, row: 1, color: 'yellow', section: 'adm_ops' },
      { id: 'adm_backup', label: 'System Backup Control\n(backup.html)', col: 17, row: 2, color: 'yellow', section: 'adm_ops' },

      // Notifications
      { id: 'adm_notifications', label: 'Notifications System\n(notifications.html / profile.html)', col: 18, row: 1, color: 'blue', section: 'adm_ops' }
    ];

    const connectionsData = [
      // --- Customer Auth Connections ---
      { from: 'cust_landing', to: 'cust_login', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_login', to: 'cust_register', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_login', to: 'cust_forgot', start: 'RIGHT', end: 'LEFT' },
      
      // Transition to Booking
      { from: 'cust_landing', to: 'cust_search', start: 'RIGHT', end: 'LEFT' },
      
      // Booking Flow
      { from: 'cust_search', to: 'cust_details', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_details', to: 'cust_room_sel', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_room_sel', to: 'cust_guest_details', start: 'RIGHT', end: 'LEFT' },
      { from: 'cust_guest_details', to: 'cust_payment', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_payment', to: 'cust_success', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_success', to: 'cust_invoice', start: 'BOTTOM', end: 'TOP' },

      // Post booking / profile
      { from: 'cust_profile', to: 'cust_notifications', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_notifications', to: 'cust_my_bookings', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_my_bookings', to: 'cust_modify_s1', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_modify_s1', to: 'cust_modify_s2', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_modify_s2', to: 'cust_modify_s3', start: 'BOTTOM', end: 'TOP' },
      { from: 'cust_modify_s3', to: 'cust_redirect_my_bookings', start: 'BOTTOM', end: 'TOP' },

      // --- Manager Connections ---
      { from: 'mgr_dashboard', to: 'mgr_bookings', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_bookings', to: 'mgr_calendar', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_calendar', to: 'mgr_guests', start: 'BOTTOM', end: 'TOP' },

      { from: 'mgr_dashboard', to: 'mgr_housekeeping', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_housekeeping', to: 'mgr_requests', start: 'BOTTOM', end: 'TOP' },

      { from: 'mgr_dashboard', to: 'mgr_checkin', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_checkin', to: 'mgr_checkout', start: 'BOTTOM', end: 'TOP' },

      { from: 'mgr_dashboard', to: 'mgr_rooms', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_rooms', to: 'mgr_room_types', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_room_types', to: 'mgr_room_avail', start: 'BOTTOM', end: 'TOP' },

      { from: 'mgr_dashboard', to: 'mgr_rep_bookings', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_rep_bookings', to: 'mgr_rep_occupancy', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_rep_occupancy', to: 'mgr_rep_payments', start: 'BOTTOM', end: 'TOP' },
      { from: 'mgr_rep_payments', to: 'mgr_rep_profile', start: 'BOTTOM', end: 'TOP' },

      { from: 'mgr_dashboard', to: 'mgr_notifications', start: 'BOTTOM', end: 'TOP' },

      // --- Admin Connections ---
      { from: 'adm_dashboard', to: 'adm_users', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_users', to: 'adm_add_user', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_add_user', to: 'adm_view_user', start: 'BOTTOM', end: 'TOP' },

      { from: 'adm_dashboard', to: 'adm_hotels', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_hotels', to: 'adm_add_hotel', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_add_hotel', to: 'adm_view_hotel', start: 'BOTTOM', end: 'TOP' },

      { from: 'adm_dashboard', to: 'adm_monitoring', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_monitoring', to: 'adm_analytics', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_analytics', to: 'adm_perf', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_perf', to: 'adm_reports', start: 'BOTTOM', end: 'TOP' },

      { from: 'adm_dashboard', to: 'adm_content', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_content', to: 'adm_edit_layout', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_edit_layout', to: 'adm_edit_info', start: 'BOTTOM', end: 'TOP' },

      { from: 'adm_dashboard', to: 'adm_audit', start: 'BOTTOM', end: 'TOP' },
      { from: 'adm_audit', to: 'adm_backup', start: 'BOTTOM', end: 'TOP' },

      { from: 'adm_dashboard', to: 'adm_notifications', start: 'BOTTOM', end: 'TOP' }
    ];

    const shapesMap = {};
    const padX = 80;
    const padY = 80;

    // Create shapes first
    for (const node of nodesData) {
      const shape = figma.createShape();
      shape.shapeType = 'ROUNDED_RECTANGLE';
      shape.resize(nodeWidth, nodeHeight);
      shape.x = node.col * gapX;
      shape.y = node.row * gapY;
      shape.fills = [{ type: 'SOLID', color: colors[node.color] }];
      shape.text.characters = node.label;
      shape.strokeWeight = 1.5;
      shape.strokeAlign = 'INSIDE';
      
      shapesMap[node.id] = shape;
    }

    // Connectors creation
    for (const conn of connectionsData) {
      const startShape = shapesMap[conn.from];
      const endShape = shapesMap[conn.to];
      if (startShape && endShape) {
        const connector = figma.createConnector();
        connector.connectorStart = {
          endpointNodeId: startShape.id,
          magnet: conn.start
        };
        connector.connectorEnd = {
          endpointNodeId: endShape.id,
          magnet: conn.end
        };
        connector.strokeWeight = 2;
      }
    }

    // Sections configuration and grouping
    const sectionsDef = [
      { id: 'cust_auth', name: 'Customer Account & Authentication' },
      { id: 'cust_booking', name: 'Customer Search & Reservation Flow' },
      { id: 'cust_mgmt', name: 'Customer Bookings Management' },
      { id: 'mgr_ops', name: 'Hotel Manager Dashboard & Operations' },
      { id: 'adm_ops', name: 'System Admin Management & Monitoring' }
    ];

    for (const secDef of sectionsDef) {
      const nodesInSec = nodesData.filter(n => n.section === secDef.id);
      if (nodesInSec.length > 0) {
        const cols = nodesInSec.map(n => n.col);
        const rows = nodesInSec.map(n => n.row);
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);

        const secX = minCol * gapX - padX;
        const secY = minRow * gapY - padY;
        const secW = (maxCol - minCol) * gapX + nodeWidth + padX * 2;
        const secH = (maxRow - minRow) * gapY + nodeHeight + padY * 2;

        const section = figma.createSection();
        section.name = secDef.name;
        section.x = secX;
        section.y = secY;
        section.resize(secW, secH);

        // Add children elements inside the native section boundary
        for (const node of nodesInSec) {
          const shape = shapesMap[node.id];
          if (shape) {
            section.appendChild(shape);
          }
        }
      }
    }

    figma.notify('Flowchart generated successfully!');
  } catch (err) {
    figma.notify('Error: ' + err.toString(), { error: true });
    console.error(err);
  }
  figma.closePlugin();
}

runPlugin();
