var profiles = [];
var filters = [];
filters.length = 0;

function updateFilter(){
    $(".searchBar").show();

    $(".seachValue").empty();
    $.each(filters, function (index, filter) {
        let f = $('<div class="filter"> </div>');
        f.html(`
            <div class="filterText">${filter}</div>
            <div class="crossBtn"> 
                <i class='fa fa-times'></i>
            </div>
        `)
        $(".seachValue").append(f);
    })
}

function updateProfiles(){
    $('.profileCards').empty();

    var filteredProfiles = [];

    if (filters.length > 0){
        filteredProfiles = profiles.filter(profile => {
            return filters.every(filter => {
                return [profile.role, profile.level, ...profile.languages, ...profile.tools].includes(filter);
            })
        })
    }else{
        filteredProfiles = profiles;
    }

    $.each(filteredProfiles, function(index, item) {

        var profileCard = $(`<div class="card profile" id="${item.id}"></div>`);
        profileCard.html(`
            <div class="profile-left">
                <div class="profile-image">
                    <img src="${item.logo}" alt="" srcset="">
                </div>
                <div class="profile-details">
                    <div class="details-top">
                        <div class="name">${item.company}</div>
                        ${item.new ? '<div class="new statusTag">NEW!</div>' : ''}
                        ${item.featured ? '<div class="featured statusTag">FEATURED</div>' : ''}
                    </div>
                    <div class="details-mid">
                        <h5 class="role">${item.position}</h5>
                    </div>
                    <div class="details-bottom">
                        <p class="time">${item.postedAt}</p>
                        <div class="bullet">&bull;</div>
                        <p class="type">${item.contract}</p>
                        <div class="bullet">&bull;</div>
                        <div class="location">${item.location}</div>
                    </div>
                </div>
            </div>
        `);

        let tags = $('<div class="profile-right"></div>');

        $.each([item.role, item.level, ...item.languages, ...item.tools], function(index, tag) {
            tags.append(`<div class="skill-tag">${tag}</div>`);
        });

        tags.append(`
            <div class="deleteBtn">
                <i class="fa fa-trash"></i>
            </div>
        `)

        $('.profileCards').append(profileCard.append(tags));
    });
}

$(document).ready(function() {
    $(".searchBar").hide();

    $.getJSON('data.json', function(data) {
        profiles = data;
        filteredProfiles= data;
        updateProfiles();

        $(".profileCards").on("click", ".skill-tag", function(event) {
            event.stopPropagation();
            let skill = $(this).text();
            if (!filters.includes(skill)) {
                filters.push(skill);
                updateFilter();
                updateProfiles();
            }

        });
    
        $(".clear").click(function() {
            filters.length = 0;
            updateFilter();
            updateProfiles();
            $(".searchBar").hide();
        });
    
        $(".searchBar").on("click", ".crossBtn", function() {
            let skillToRemove = $(this).prev().text();
            filters = filters.filter(filter => filter !== skillToRemove);
            updateFilter();
            updateProfiles();
            if (filters.length <= 0){
                $(".searchBar").hide();
            }
        });

        $(".profileCards").on("click", ".profile", function() {

            let id = $(this).attr("id");
            let profile = profiles.find(p => p.id == id);

            $("#jobDetails>.popup-content").empty();

            var popUpClose = $(`
                <div class="popUpClose">
                    <i class="fa fa-times"></i>
                </div>
            `)

            var popupTitle = $('<div class="popUpTitle"></div>');

            popupTitle.html(`
                <img src="${profile.logo}" alt="Company Logo" width="100">
                <span>
                    <h2>${profile.company} Job Details</h2>
                    <span>
                        ${profile.new === true ? '<div class="new statusTag" id="newTag">NEW!</div>' : ''}
                        ${profile.featured === true ? '<div class="featured statusTag" id="featuredTag">FEATURED</div>' : ''}
                    </span>
                </span>
            `)

            var popupTable = $('<div class="popupTable"></div>');

            popupTable.html(`
                <div class="popUpRow">
                    <div class="popUpRowHead">Position</div>
                    <div class="popUpRowData">${profile.position}</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Role</div>
                    <div class="popUpRowData">${profile.role}</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Level</div>
                    <div class="popUpRowData">${profile.level}</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Posted</div>
                    <div class="popUpRowData">${profile.postedAt}</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Contract</div>
                    <div class="popUpRowData">${profile.contract}</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Location</div>
                    <div class="popUpRowData">${profile.location}</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Languages</div>
                    <div class="popUpRowData">${profile.languages.length > 0 ? profile.languages : "-" }</div>
                </div>

                <div class="popUpRow">
                    <div class="popUpRowHead">Tools</div>
                    <div class="popUpRowData">${profile.tools.length > 0 ? profile.tools : "-" }</div>
                </div>
            `)

            $("#jobDetails>.popup-content").append(popUpClose, popupTitle, popupTable);

            $("#jobDetails").css("display", "flex");

        });

        $(".popUpClose").click(function() {
            $("#jobDetails").css("display", "none");
            $("#addPost").css("display", "none");
        })
        
        $(".popup-content").click(function(event) {
            if (!$(event.target).closest(".popUpClose").length) {
                if (!$(event.target).closest(".deleteBtn").length) {
                    event.stopPropagation();
                }
            }
        });

        $(".popup-container").click(function() {
            $("#jobDetails").css("display", "none");
            $("#addPost").css("display", "none");
        })

        $(".addBtn").on("click", function(event){
            $("#addPost").css("display", "flex");
            $(".error").hide();
        })

        $("#jobPostingForm").submit(function(event) {
            event.preventDefault();
    
            var company = $("#company").val();
            var logo = $("#logo").val();
            var isNew = $("#new").is(":checked");
            var isFeatured = $("#featured").is(":checked");
            var position = $("#position").val();
            var role = $("#role").val();
            var level = $("#level").val();
            var contract = $("#contract").val();
            var location = $("#location").val();
    
            var languages = [];
            $("input[name='languages']:checked").each(function() {
                languages.push($(this).val());
            });
    
            var tools = [];
            $("input[name='tools']:checked").each(function() {
                tools.push($(this).val());
            });

            var errors = [];

            if (company.length <= 3) {
                errors.push("Company name should be greater than 3 characters");
            }

            if (languages.length < 2){
                errors.push("Must select at least two Languages");
            }

            if (errors.length > 0) {
                var errorList = $(".error");
                errorList.empty();
                $(".error").show();
                errors.forEach(function(error) {
                    errorList.append($(`
                        <p>
                            <i class="fa fa-times"></i> 
                            &nbsp;${error}
                        </p>
                    `));
                });
                return;
            }

            if(errors.length == 0){
                var newProfile = {
                    id: profiles.length + 1,
                    company: company,
                    logo: logo,
                    new: isNew,
                    featured: isFeatured,
                    position: position,
                    role: role,
                    level: level,
                    postedAt: "1h ago",
                    contract: contract,
                    location: location,
                    languages: languages,
                    tools: tools
                };
                profiles.push(newProfile);
                $("#jobPostingForm")[0].reset();
                $("#addPost").css("display", "none");
                updateProfiles();
            }
            
        });

        $(".profileCards").on("click", ".deleteBtn", function(event){
            event.stopPropagation();
            let id = $(this).parent().parent().attr("id");
            console.log(id);
            profiles = profiles.filter(p => p.id != id);
            console.log(profiles);
            $("#jobDetails").css("display", "none");
            updateProfiles();
        })

        

    });    
});


