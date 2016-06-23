/**
 *
 * Created by johanhenkens on 5/5/14.
 */

IDE_Morph.prototype.createCloudAccount = function () {
    var myself = this,
        world = this.world();
    /*
     // force-logout, commented out for now:
     delete localStorage['-snap-user'];
     SnapCloud.clear();
     */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.signup(
                user.username,
                user.email,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                            txt +
                            '.\n\nAn e-mail with your password\n' +
                            'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudsignup').promptCredentials(
        'Sign up',
        'signup',
        'http://snap.berkeley.edu/tos.html',
        'Terms of Service...',
        'http://snap.berkeley.edu/privacy.html',
        'Privacy...',
        'I have read and agree\nto the Terms of Service',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.resetCloudPassword = function () {
    var myself = this,
        world = this.world();
    /*
     // force-logout, commented out for now:
     delete localStorage['-snap-user'];
     SnapCloud.clear();
     */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.resetPassword(
                user.username,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                            txt +
                            '.\n\nAn e-mail with a link to\n' +
                            'reset your password\n' +
                            'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudresetpassword').promptCredentials(
        'Reset password',
        'resetPassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.changeCloudPassword = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.changePassword(
                user.oldpassword,
                user.password,
                function () {
                    myself.logout();
                    myself.showMessage('password has been changed.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudpassword').promptCredentials(
        'Change Password',
        'changePassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.createCloudAccount = function () {
    var myself = this,
        world = this.world();
    /*
     // force-logout, commented out for now:
     delete localStorage['-snap-user'];
     SnapCloud.clear();
     */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.signup(
                user.username,
                user.email,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                            txt +
                            '.\n\nAn e-mail with your password\n' +
                            'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudsignup').promptCredentials(
        'Sign up',
        'signup',
        'http://snap.berkeley.edu/tos.html',
        'Terms of Service...',
        'http://snap.berkeley.edu/privacy.html',
        'Privacy...',
        'I have read and agree\nto the Terms of Service',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.resetCloudPassword = function () {
    var myself = this,
        world = this.world();
    /*
     // force-logout, commented out for now:
     delete localStorage['-snap-user'];
     SnapCloud.clear();
     */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.resetPassword(
                user.username,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                            txt +
                            '.\n\nAn e-mail with a link to\n' +
                            'reset your password\n' +
                            'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudresetpassword').promptCredentials(
        'Reset password',
        'resetPassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.changeCloudPassword = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.changePassword(
                user.oldpassword,
                user.password,
                function () {
                    myself.logout();
                    myself.showMessage('password has been changed.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudpassword').promptCredentials(
        'Change Password',
        'changePassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};


IDE_Morph.prototype.logout = function () {
    var myself = this;
    delete localStorage['-snap-user'];
    SnapCloud.logout(
        function () {
            SnapCloud.clear();
            myself.showMessage('disconnected.', 2);
        },
        function () {
            SnapCloud.clear();
            myself.showMessage('disconnected.', 2);
        }
    );
};

