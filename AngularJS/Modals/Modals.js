
/**
 * Use a run block to ensure the modal will open from anywhere in the app.
 **/
UserMgmtapp.run(function ($rootScope, $uibModal) {
    /**
     * Listen to the `$stateChangeStart` event
     */
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        /**
         * if the new state is not "terms", then ignore it
         */
        if (toState.name !== 'IGMDetails') return;
        /**
         * Open the modal window
         */
        $uibModal.open({
            templateUrl: '/Templates/IGMDetails.html',
            controller: 'ImportController'
        });
        /**
         * Prevent the transition to the dummy state, stay where you are
         */
        event.preventDefault();
    })
})