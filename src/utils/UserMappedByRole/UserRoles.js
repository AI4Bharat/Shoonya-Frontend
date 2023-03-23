export default [
    {
        label: "Annotator", 
        role: 1,
         roleAnnotatorReviewer: true, 
         AnnotatorRecentTasks:true,
         AnnotatorMyProgress:true,
         hidetabs:true,
         hideActionscolumn:true,
         
    },
    {
        label: "Reviewer",
         role: 2, 
         roleAnnotatorReviewer: true, 
         AnnotatorRecentTasks:true,
         AnnotatorMyProgress:true,
         hidetabs:true,
         hideActionscolumn:true,
      
    },
    {
        label: "SuperChecker", 
        role: 3, 
        roleAnnotatorReviewer: true, 
        AnnotatorRecentTasks:true,
        AnnotatorMyProgress:true,
        hidetabs:true,
        hideActionscolumn:true,
    },
    {
        label: "WorkspaceManager", 
        role: 4, 
        roleManager: true, 
        projectSettingsIconButton:true,
        MyProgress:true,
        RecentTasks:true,
        deallocationAnnotatorsAndReviewers:true,
        ArchivedProjectsFilter:true,
        allTaskTab:true,
        Choicetranslationmodel:true,
      
    },
    {
        label: "OrganizationOwner", 
        role: 5,  
        roleOrganizationOwner: true,
        projectSettingsIconButton:true,
        MyProgress:true,
        RecentTasks:true,
        deallocationAnnotatorsAndReviewers:true,
        ArchivedProjectsFilter:true,
        allTaskTab:true,
        hideWorkspaces:true,
    },
    {
        label: "Admin", 
        role: 6, 
        roleOrganizationOwner: true,
        projectSettingsIconButton:true,
        MyProgress:true,
        RecentTasks:true,
        deallocationAnnotatorsAndReviewers:true,
        ArchivedProjectsFilter:true,
        allTaskTab:true,
        
    }
]