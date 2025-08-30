const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of MAD(wo)MEN EventTicket contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy the EventTicket contract
  const EventTicket = await ethers.getContractFactory("EventTicket");
  
  // Contract parameters
  const eventName = "MAD(wo)MEN Hackathon 2024";
  const eventSymbol = "MADWOMEN";
  const organizer = deployer.address; // For demo, organizer is the deployer

  console.log("🏗️  Deploying EventTicket contract...");
  console.log("   Event Name:", eventName);
  console.log("   Event Symbol:", eventSymbol);
  console.log("   Organizer:", organizer);

  const eventTicket = await EventTicket.deploy(eventName, eventSymbol, organizer);
  await eventTicket.waitForDeployment();

  const contractAddress = await eventTicket.getAddress();
  console.log("✅ EventTicket deployed to:", contractAddress);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  
  const deployedEventName = await eventTicket.eventName();
  const deployedEventSymbol = await eventTicket.eventSymbol();
  const deployedOrganizer = await eventTicket.organizer();
  
  console.log("   ✅ Event Name:", deployedEventName);
  console.log("   ✅ Event Symbol:", deployedEventSymbol);
  console.log("   ✅ Organizer:", deployedOrganizer);
  
  console.log("🎉 Deployment completed successfully!");
  console.log("📋 Contract Address:", contractAddress);
  
  // Save deployment info for the backend
  const deploymentInfo = {
    contractAddress: contractAddress,
    eventName: eventName,
    eventSymbol: eventSymbol,
    organizer: organizer,
    network: "sepolia",
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  console.log("📄 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
