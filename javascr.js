document.getElementById('fetchProfile').addEventListener('click', async function () {
    const handle = document.getElementById('profileName').value.trim();
    if (handle === "") {
        alert("Please enter a Codeforces handle.");
        return;
    }

    try {

        const profileResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const profileData = await profileResponse.json();
        if (profileData.status === 'OK') {
            const user = profileData.result[0];
            const profileInfoDiv = document.getElementById('profileInfo');
            profileInfoDiv.style.display = 'block';
            profileInfoDiv.innerHTML = `
                <h2>${user.handle}</h2>
                <p><strong>Name:</strong> ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}</p>
                <p><strong>Rank:</strong> ${user.rank || 'N/A'}</p>
                <p><strong>Current Rating:</strong> ${user.rating || 'N/A'}</p>
                <p><strong>Max Rating:</strong> ${user.maxRating || 'N/A'}</p>
                <p><strong>Country:</strong> ${user.country || 'N/A'}</p>
                <p><strong>City:</strong> ${user.city || 'N/A'}</p>
                <p><strong>Friend of:</strong> ${user.friendOfCount || 'N/A'}</p>
                <p><strong>Organization:</strong> ${user.organization || 'N/A'}</p>
            `;
        } else {
            alert("User not found or an error occurred.");
        }

        const submissionResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const submissionData = await submissionResponse.json();

        if (submissionData.status === 'OK') {
            const unsolvedProblems = submissionData.result.filter(submission => submission.verdict !== 'OK');
            const SolvedProblems = submissionData.result.filter(submission => submission.verdict === 'OK');
            displayUnsolvedProblems(unsolvedProblems, SolvedProblems);
        } else {
            alert("Error fetching submissions.");
        }

    } catch (error) {
        alert("Failed to fetch profile or submissions. Please try again later.");
    }
});


function displayUnsolvedProblems(unsolvedproblems, solvedproblems) {
    const unsolvedProblemsDiv = document.getElementById('unsolvedProblems');
    unsolvedProblemsDiv.innerHTML = '';
    const allproblems = unsolvedproblems.filter(unsolved => {
        return !solvedproblems.some(solved =>
            solved.contestId === unsolved.contestId && solved.problem.index === unsolved.problem.index
        );
    });
    const problems = [];
    const repeating = new Map();
    allproblems.forEach(problem => {
        const key = `${problem.contestId}-${problem.problem.index}`;
        if (!repeating.has(key)) {
            repeating.set(key, true);
            problems.push(problem);
        }
    })
    const countdiv=document.createElement('div');
    countdiv.innerHTML = `
        <p><strong>Total No.of Unsolved Problems:</strong> ${problems.length}</p>
        <p><strong>Total No.of Solved Problems:</strong> ${solvedproblems.length}</p>
    `
    document.getElementById('count').appendChild(countdiv);
    if (problems.length === 0) {
        unsolvedProblemsDiv.innerHTML = '<p>No unsolved problems found.</p>';
        return;
    }
    problems.forEach(problem => {
        const problemDiv = document.createElement('div');
        problemDiv.classList.add('problem');
        const problemLink = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.problem.index}`;
        problemDiv.innerHTML = `
            <a href="${problemLink}" target="_blank">
                Problem ${problem.problem.name} - Contest ID: ${problem.contestId}, Problem Index: ${problem.problem.index}
            </a>
        `;
        unsolvedProblemsDiv.appendChild(problemDiv);
    });
}
