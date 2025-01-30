git reset HEAD~1
rm ./backport.sh
git cherry-pick aaae17f2963de85c2a7764db1bfd6483cab00046
echo 'Resolve conflicts and force push this branch'
